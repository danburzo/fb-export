let fs = require('fs-extra');
let rp = require('request-promise');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const post_fields = [
	'id',
	'message',
	'created_time',
	'link',
	'picture',
	'description',
	'shares',
	'likes',
	'reactions',
	'sharedposts',
	'comments{comments,created_time,from,message}',
	'attachments',
	'type'
];

fetch_posts('https://graph.facebook.com/v2.11/me/posts', 'export/posts.json');

/* 
	Functions
	------------------------------------------------------------
*/

function fetch_posts(api, outFile) {
	let posts = [];
	let url_queue = [api];
	fetch_posts_page(url_queue, function(data) {
		fs.outputFile(outFile, JSON.stringify(data, null, 2));
		console.info(`Exported ${data.length} posts to ${outFile}`);
	});
};

function fetch_posts_page(pages_queue, callback, accumulator = []) {
	if (pages_queue.length) {
		let uri = pages_queue.shift();
		rp({
			uri: uri,
			qs: {
				access_token: config.access_token,
				limit: 100,
				fields: post_fields.join(',')
			},
			json: true
		}).then(response => {
			fetch_posts_page(
				pages_queue.concat(
					response.paging && response.paging.next ? 
						[response.paging.next] : []
				), callback, accumulator.concat(response.data));
		})
	} else {
		callback(accumulator);
	}
}

