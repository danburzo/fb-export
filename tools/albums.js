let fs = require('fs-extra');
let rp = require('request-promise');
let request = require('request');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

function largest_first(a, b) {
	return (a.width * a.height - b.width * b.height) * -1;
};

rp({
	uri: `https://graph.facebook.com/v2.11/me/albums`,
	qs: {
		limit: 100,
		access_token: config.access_token
	},
	json: true
}).then(response => {
	let albums = response.data;
	request_albums(albums.slice(), function() {
		fs.outputFile('export/json/albums.json', JSON.stringify(albums, null, 2));
	});
});

function request_albums(album_queue, callback) {
	if (album_queue.length) {
		let album = album_queue.shift();
		request_album_photos(
			[`https://graph.facebook.com/v2.11/${album.id}/photos?fields=id,images&limit=100&access_token=${config.access_token}`],
			photos => {
				fetch_photo_files(photos, `export/albums/${album.id}`, function() {
					request_albums(album_queue, callback);
				});
			}
		)
	} else {
		callback();
	}
};

function request_album_photos(photos_queue, callback, accumulator = []) {
	if (photos_queue.length) {
		let photo_batch = photos_queue.shift();
		rp({
			url: photo_batch,
			json: true
		}).then(response => {
			request_album_photos(
				photos_queue.concat(
					response.paging && response.paging.next ? 
						[response.paging.next] : []
				), 
				callback, 
				accumulator.concat(response.data)
			)
		})
	} else {
		callback(accumulator);
	}
};

function fetch_photo_files(photos, dir, callback) {
	if (photos.length) {
		let photo = photos.shift();
		fs.ensureDir(dir, () => {
			request(
				photo.images.sort(largest_first)[0].source, 
				() => fetch_photo_files(photos, dir, callback)
			).pipe(
				fs.createWriteStream(`${dir}/${photo.id}.jpg`)
			);
		});
	} else {
		callback();
	}
}