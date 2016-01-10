'use strict';

var async = require('async');
var WhatClient = require('./lib/client');
var _ = require('lodash');
var fs = require('fs');
var https   = require('https');
var config = require('config.json')('./config.json');
var client = new WhatClient(config.base_url, config.username, config.password);

var torrentArray = [];
var downloadedTorrents = [];

var getTopTen = function() {
  console.log('RUNNING:', Date());
  client.top10(function(err, data) {
    if(err) {
      return console.log(err);
    }

    // this [0] is daily
    for(var torrent in data[0].results) {
      var torrentData = data[0].results[torrent];
      // console.log('TORRENT:', torrentData);
      var torrentId = torrentData.torrentId;
      if(torrentData.size < config.max_torrent_size &&
        !_.contains(downloadedTorrents, torrentId)) {
        torrentArray.push(torrentId);
      }
    }
    console.log('TORRENTARRAY:', torrentArray);
    console.log('DOWNLOADED:', downloadedTorrents);
    async.each(torrentArray, getTorrent, function(err) {
      if(err) {
        console.log('ERROR:', err);
      } else {
        console.log('DONE.');
      }
      torrentArray = [];
      setTimeout(getTopTen, config.process_interval);
    });
  });
};

var getTorrent = function(id, callback) {
  var options = {
    hostname  : 'what.cd',
    port      : 443,
    path      : config.path + id,
    method    : 'GET'
  };

  var regexp = /filename=\"(.*)\"/gi;

  var req = https.request(options, function(res) {
   //  console.log('statusCode:', res.statusCode);
   //  console.log('headers:', res.headers);
    var filename = regexp.exec(res.headers['content-disposition'])[1];
    console.log('FILENAME:', filename);
    var file = fs.createWriteStream(config.basepath + filename);

    res.on('data', function(d) {
      file.write(d);
    });

    res.on('end', function() {
      downloadedTorrents.push(id);
      callback(null);
    });
  });
  req.end();

  req.on('error', function(err) {
    callback(err);
  });
};

getTopTen();
