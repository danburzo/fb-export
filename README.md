# fb-export

Export (most) of your Facebook data using Node.js and the Graph API.

## Introduction

Currently the scripts let you export:

* your posts
* your timeline photos

To do:

* your albums

__Attention!__ Although I've checked against my own account for accurracy, these scripts are __no guarantee__ that all your content is exported, so exercise caution if you plan to delete the content afterwards.

## Installation

You'll need Node.js, NPM and, optionally, Yarn (which these instructions use throughout). Since I wrote the scripts with ES6 syntax for its conciseness, this only probably works with more recent versions of Node. (I'm currently using `v8.9.0`).

Clone the repository to your computer and run `yarn` (or `npm install`) in your project's folder to install all the necessary dependencies.

Rename the `sample.config.json` file to `config.json` and put in the *access token* you can get from the [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/):

1. Click on _Get access token_ and choose _Get User Access token_.
2. Check all the permissions in the first set ("User Access Permissions").
3. Put the access token in your `config.json`

(Since this allows anyone to access your data through the API, we're not putting `config.json` on GitHub.)

## Tools

### Exporting your Facebook posts

Run `node tools/posts.js` to export your Facebook posts to JSON (in `export/json/posts.json`). Check the source code to see which fields are currently fetched, and add your own to suit your needs. [See this page](https://developers.facebook.com/docs/graph-api/reference/v2.11/post) for available fields.

### Exporting your Facebook photos

__Note:__ You'll need to have run the _Exporting your Facebook posts_ tool beforehand, so you have a `posts.json` to use.

Run `node tools/photos.js` to export your Facebook photos to the `export/photos` folder.