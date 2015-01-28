/*jslint node: true */
/*jslint nomen: true */

"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');

var auth = require('./auth');
var lib = require('./lib');

module.exports = function (app) {
	app.use('/lib', lib);
	app.use(express.Router().use(express.static(path.join(__dirname, '../dist/'))));
	app.get('/', function (req, res) {
		res.render('index');
	});
	app.get('/monitor', function (req, res) {
		res.render('monitor');
	});
	app.use(auth);
};
