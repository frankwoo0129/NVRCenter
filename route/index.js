var fs = require('fs');
var path = require('path');
var express = require('express');
var hbs = require('hbs');

var lib = require('./lib');

module.exports = function(app) {
	app.use(function(req, res, next) {
		if (req.session.itema) {
			console.log(req.session.itema);
		} else {
			req.session.itema = '2222';
		}
		console.log(JSON.stringify(req.session));
		next();
	});
	app.use('/lib', lib);
	app.use(express.static(path.join(__dirname, '../dist/')));
	app.get('/', function(req, res) {
		res.render('index');
	});
};
