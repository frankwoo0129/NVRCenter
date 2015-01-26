var fs = require('fs');
var path = require('path');
var express = require('express');

var root = express.Router();

//var router_videojs = express.Router();
//var router_videojs_contrib_media_sources = express.Router();
//var router_videojs_contrib_hls = express.Router();
//router_videojs.use(express.static(path.join(__dirname, '../bower_components/video.js/dist/video-js/')));
//router_videojs_contrib_media_sources.use(express.static(path.join(__dirname, '../bower_components/videojs-contrib-hls/node_modules/videojs-contrib-media-sources/src/')));
//router_videojs_contrib_hls.use(express.static(path.join(__dirname, '../bower_components/videojs-contrib-hls/src/')));
//router_pkcs7.use(express.static(path.join(__dirname, '../bower_components/videojs-contrib-hls/node_modules/pkcs7/dist/')));

root.use('/videojs', express.Router().use(express.static(path.join(__dirname, '../bower_components/video.js/dist/video-js/'))));
root.use('/videojs-contrib-media-sources', express.Router().use(express.static(path.join(__dirname, '../bower_components/videojs-contrib-media-sources/src/'))));
root.use('/videojs-contrib-hls', express.Router().use(express.static(path.join(__dirname, '../bower_components/videojs-contrib-hls/src/'))));
root.use('/bootstrap', express.Router().use(express.static(path.join(__dirname, '../bower_components/bootstrap/dist/'))));
root.use('/fullcalendar', express.Router().use(express.static(path.join(__dirname, '../bower_components/fullcalendar/dist/'))));
root.use('/jquery', express.Router().use(express.static(path.join(__dirname, '../bower_components/jquery/'))));
root.use('/jquery-ui', express.Router().use(express.static(path.join(__dirname, '../bower_components/jquery-ui/'))));
root.use('/moment', express.Router().use(express.static(path.join(__dirname, '../bower_components/moment/min/'))));
root.use('/underscore', express.Router().use(express.static(path.join(__dirname, '../bower_components/underscore/'))));
	
module.exports = root;
