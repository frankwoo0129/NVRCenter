/*jslint node: true */
/*jslint nomen: true */
/*jslint es5: true */
"use strict";

var path = require('path');
var express = require('express');

var auth = require('./auth');
var lib = require('./lib');
var list = require('./list');

module.exports = function (app) {
	app.use('/lib', lib);
	app.use(express.static(path.join(__dirname, '../dist/')));
	
	app.get('/', function (req, res) {
		res.render('index');
	});

	app.get('/monitor', function (req, res) {
		res.render('monitor');
	});

	app.get('/admin', function (req, res) {
		res.render('admin');
	});

	app.get('/video', function (req, res) {
		res.render('video');
	});

	app.use(auth);
	
	app.use('/list', list);
	app.get('/monitor/:address/*', function (req, res) {
		res.redirect('http://' + req.socket.localAddress + ':3000' + req.originalUrl);
	});
};
