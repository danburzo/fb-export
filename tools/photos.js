let rp = require('request-promise');
let request = require('request');
let fs = require('fs-extra');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const posts = JSON.parse(fs.readFileSync('export/json/posts.json', 'utf8'));

const single_photo_types = ['photo', 'profile_media', 'cover_photo'];
const multiple_photo_types = ['album', 'new_album'];
const photo_types = single_photo_types.concat(multiple_photo_types);

const flatten = (acc, curr) => acc.concat(curr);
const largest_image_first = (a, b) => -1 * (a.width * a.height - b.width * b.height);

const photos = posts
	.map(
		post => post.attachments ?
			post.attachments.data
				.filter(attachment => photo_types.includes(attachment.type))
				.map(
					attachment => single_photo_types.includes(attachment.type) ?
						[
							{
								...attachment,
								post_id: post.id
							}
						] 
						:
						attachment.subattachments.data.map(
							subattachment => (
								{
									...subattachment,
									post_id: post.id
								}
							)
						)
				)
			:
			[]
	)
	.filter(arr => arr.length)
	.reduce(flatten, [])
	.reduce(flatten, []);

fetch_queue(photos, function(attachment_urls) {
	fs.ensureDir('export/photos', () => {
		fetch_images(attachment_urls, function() {
			console.info('Done fetching images');
		});
	});
});

/* 
	Functions
	-----------------------------------------------------------
*/

function fetch_queue(attachment_queue, callback, accumulator = []) {
	if (attachment_queue.length) {
		let attachment = attachment_queue.shift();
		if (attachment.type === 'cover_photo' || attachment.type === 'profile_media') {
			fetch_queue(
				attachment_queue, 
				callback, 
				accumulator.concat([
					{
						url: attachment.media.image.src,
						id: attachment.post_id,
						post_id: attachment.post_id
					}
				])
			);
		} else {
			rp({
				uri: `https://graph.facebook.com/v2.11/${attachment.target.id}`,
				qs: {
					// Send the access token on the request
					access_token: config.access_token,

					// The fields to fetch
					fields: 'images'
				},
				json: true
			}).then(response => {
				let url = response.images.sort(largest_image_first)[0].source;
				fetch_queue(
					attachment_queue,
					callback,
					accumulator.concat([
						{
							url: url,
							id: attachment.target.id,
							post_id: attachment.post_id
						}
					])
				)
			});
		}
	} else {
		callback(accumulator);
	}
};

function fetch_images(image_queue, callback) {
	if (image_queue.length) {
		let image = image_queue.shift();
		request({
			url: image
		}, () => 
			fetch_images(image_queue, callback)
		).pipe(
			fs.createWriteStream(`export/photos/${image.id}.jpg`)
		)
	} else {
		callback();
	}
};
