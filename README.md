# fb-export

[![Greenkeeper badge](https://badges.greenkeeper.io/danburzo/fb-export.svg)](https://greenkeeper.io/)

Export (most) of your Facebook data using Node.js and the Graph API.

## Introduction

Crowbarring your data out of Facebook is no easy feat — to get everything out you'll need a combination of [Graph API](https://developers.facebook.com/docs/graph-api/) wrangling and old-fashioned manual labor — but it's not impossible. 

The purpose of this repository is to give you some tools to make the whole process a bit smoother.

### Why not use Facebook's own "Download your data"

Facebook offers a way to [download your data](https://www.facebook.com/help/212802592074644) that sounds [comprehensive enough](https://www.facebook.com/help/405183566203254), and I encourage you to first download that data and see if the amount of information and its quality are sufficient for your purposes — if so, you're in luck.

If, however, you'd like a more structured dataset and images in a better resolution, the tools below can help you. Here's what's included so far:

Data | Notes
---- | -----
Posts | Things you posted on your timeline.
Timeline photos | Photos attached to timeline posts <sup>1</sup>
Albums | Your photo albums. <sup>1</sup>
Photos you're tagged in | A subset of "Pictures of you", i.e. photos in which other people / Pages have tagged you <sup>2</sup>

#### Notes

* <sup>1</sup> __Videos are not fetched at the moment!__
* <sup>2</sup> __Not all "Pictures of you" are accessible through the Graph API__, you'll need to manually download the other photos.

#### A word of caution

Although I've checked against my own account for a modicum of accuracy in the exported data, these scripts are __no guarantee__ that your content is comprehensively and accurately exported, so exercise caution if you plan to delete the content afterwards.

## Installation

### Prerequisites

You'll need [Node.js](https://nodejs.org/en/), NPM (it comes with Node) and, optionally, [Yarn](https://yarnpkg.com/en/) (which these instructions use throughout). 

Since I wrote the scripts with ES6 syntax for its brevity, this only probably works with more recent versions of Node. (I'm currently using `v8.9.0`).

### Setting things up

1. Clone this repository to your computer
2. Run `yarn` (or `npm install`) in your project's folder to install all the necessary dependencies
3. Rename the `sample.config.json` file to `config.json` (you can do that in the terminal with `mv sample.config.json config.json`) and put in the *access token* you get from the [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/). 

(Since the token allows anyone to access your data through the API, we're not putting the actual `config.json` on GitHub.)

#### Getting an access token

1. Go to the [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/) page.
2. Click on _Get access token_ and choose _Get User Access token_.
3. Check all the permissions in the first set ("User Access Permissions"), and follow the approval screens to generate the token.
3. Put the access token in your `config.json`.

## Tools

Tool | Command | Notes
---- | ------- | -----
Export your Facebook posts | `node tools/posts.js` | This exports your Facebook posts to JSON in `export/json/posts.json`. You can look in the source code to see which fields are currently fetched, and add your own to suit your needs. [See this page](https://developers.facebook.com/docs/graph-api/reference/v2.11/post) for available fields.
Export timeline photos | `node tools/photos.js` | The photos are downloaded in the `export/photos` folder. __Note__ that you'll need to have run the post exporter beforehand, because the script uses the `posts.json` as a basis.
Generate a HTML timeline | `node tools/timeline.js` | This generates a HTML timeline based on `posts.json` and the downloaded photos, so you'll need to have run the two tools above for it to work.
Export your albums | `node tools/albums.js` | Fetches the images from your Facebook albums into the `export/albums` folder, and stores the album info in the `export/json/albums.json` file.