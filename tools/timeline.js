let ejs = require('ejs');
let fs = require('fs-extra');
let scapegoat = require('scapegoat');
let escape = scapegoat.escape;
let unescape = scapegoat.unescape;

var posts = JSON.parse(fs.readFileSync('export/json/posts.json', 'utf8'));
var template = ejs.compile(fs.readFileSync('templates/timeline.ejs.html', 'utf8'), {});

fs.outputFile('export/html/timeline.html', template({
	posts: posts.map(post => 
		Object.assign({}, post, {
			message: escape(post.message || '').replace(/\n/g, '<br/>'),
			description: escape(post.description || '').replace(/\n/g, '<br/>')
		})
	)
}));