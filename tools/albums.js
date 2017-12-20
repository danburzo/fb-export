let fs = require('fs-extra');
let rp = require('request-promise');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));