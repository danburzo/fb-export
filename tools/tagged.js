let fs = require('fs-extra');
let request = require('request');
let rp = require('request-promise');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const largest_first = (a, b) => (a.width * a.height - b.width * b.height) * -1;

const export_dir = 'export/tagged-photos';

rp({
	url: 'https://graph.facebook.com/v2.11/me/photos',
	qs: {
		access_token: config.access_token,
		limit: 100,
		type: 'tagged',
		fields: ['id', 'message', 'images'].join(',')
	},
	json: true
}).then(response => {
	fs.outputFile('export/json/tagged-photos.json', JSON.stringify(response.data, null, 2));
	response.data.forEach(image => {
		fs.ensureDir(export_dir, function() {
			let largest_size = image.images.sort(largest_first)[0].source;
			request(largest_size).pipe(fs.createWriteStream(`${export_dir}/${image.id}.jpg`));
		});
	});
});