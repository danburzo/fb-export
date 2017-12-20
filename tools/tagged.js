let fs = require('fs-extra');
let request = require('request');
let rp = require('request-promise');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const largest_first = (a, b) => (a.width * a.height - b.width * b.height) * -1;

const export_dir = 'export/tagged-photos';

fetch_tagged_photos(
	[`https://graph.facebook.com/v2.11/me/photos?type=tagged&access_token=${config.access_token}&fields=id,message,images`],
	data => {
		fs.outputFile('export/json/tagged-photos.json', JSON.stringify(data, null, 2));
		fetch_photo_files(data, () => {
			console.info('Fetched tagged photos');
		});
	}
);

function fetch_tagged_photos(photos_queue, callback, accumulator = []) {
	if (photos_queue.length) {
		let url = photos_queue.shift();
		console.log('Fetching: ', url);
		rp({
			uri: url,
			json: true
		}).then(response => {
			fetch_tagged_photos(
				photos_queue.concat(
					response.paging && response.paging.next ? 
						[ response.paging.next ] :
						[]
				),
				callback,
				accumulator.concat(response.data)
			)	
		})
	} else {
		callback(accumulator);
	}
};

function fetch_photo_files(photos, callback) {
	if (photos.length) {
		let photo = photos.shift();
		fs.ensureDir(export_dir, function() {
			let largest_size = photo.images.sort(largest_first)[0].source;
			request(largest_size, () => {
				fetch_photo_files(photos, callback);
			}).pipe(fs.createWriteStream(`${export_dir}/${photo.id}.jpg`));
		});
	} else {
		callback();
	}
};

