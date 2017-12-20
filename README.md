# fb-export

Export (most) of your Facebook data using Node.js and the Graph API.

## Introduction

Crowbarring your data out of Facebook is no easy feat — to get everything out you'll need a combination of [Graph API](https://developers.facebook.com/docs/graph-api/) wrangling and old-fashioned manual labor — but it's not impossible. 

The purpose of this repository is to give you some tools to make the whole process a bit smoother.

### Why not use Facebook's own "Download your data"

Facebook offers a way to [download your data](https://www.facebook.com/help/212802592074644) that sounds [comprehensive enough](https://www.facebook.com/help/405183566203254), and I encourage you to first download that data and see if the amount of information and its quality is sufficient for your purposes — if so, you're in luck.

If, however, you'd like a more structured dataset and images in a better resolution, the tools below can help you. Here's what's included so far:

Data | Notes
---- | -----
Posts | Things you posted on your timeline.
Timeline photos | Photos attached to timeline posts <sup>1</sup>
Albums | Your photo albums. <sup>1</sup>
Photos you're tagged in | A subset of <sup>2</sup>

#### Notes

* <sup>1</sup> __Videos are not fetched at the moment!__
* <sup>2</sup> __Not all "Pictures of you" are accessible through the Graph API__, you'll need to manually download the other photos.

#### A word of caution

Although I've checked against my own account for a modicum of accurracy in the exported data, these scripts are __no guarantee__ that all your content is comprehensively and accurately exported, so exercise caution if you plan to delete the content afterwards.

## Installation

### Prerequisites

You'll need Node.js, NPM and, optionally, Yarn (which these instructions use throughout). Since I wrote the scripts with ES6 syntax for its conciseness, this only probably works with more recent versions of Node. (I'm currently using `v8.9.0`).

### Setting things up

Clone the repository to your computer and run `yarn` (or `npm install`) in your project's folder to install all the necessary dependencies.

__Rename__ the `sample.config.json` file to `config.json` (you can do that in the terminal with `mv sample.config.json config.json`) and put in the *access token* you can get from the [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/). Since the token allows anyone to access your data through the API, we're not putting the actual `config.json` on GitHub.

#### Getting an access token

1. Go to the [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/) page.
2. Click on _Get access token_ and choose _Get User Access token_.
3. Check all the permissions in the first set ("User Access Permissions"), and follow the approval screens to generate the token.
3. Put the access token in your `config.json`.

## Tools

### Exporting your Facebook posts

Run `node tools/posts.js` to export your Facebook posts to JSON (in `export/json/posts.json`). Check the source code to see which fields are currently fetched, and add your own to suit your needs. [See this page](https://developers.facebook.com/docs/graph-api/reference/v2.11/post) for available fields.

### Exporting your Facebook photos

__Note:__ You'll need to have run the _Exporting your Facebook posts_ tool beforehand, so you have a `posts.json` to use.

Run `node tools/photos.js` to export your Facebook photos to the `export/photos` folder.

### Generate your HTML timeline

__Note:__ You'll have to have exported your posts and photos (tools above) beforehand.

Run `node tools/timeline.js` to generate your HTML timeline in the `export/html` folder.

### Exporting your albums

Run `node tools/albums.js` to fetch the images from your Facebook albums into the `export/albums` folder. Information about your albums is stored in `export/json/albums.json`.