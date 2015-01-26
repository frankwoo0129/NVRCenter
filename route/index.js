var fs = require('fs');
var path = require('path');
var express = require('express');
var hbs = require('hbs');

var lib = require('./lib');

module.exports = function(app) {
	app.set('view engine', 'html');
	app.engine('html', hbs.__express);
	app.use('/lib', lib);
	app.use(express.static(path.join(__dirname, '../dist/')));
	app.get('/', function(req, res) {
		res.render('index');
	});
};
