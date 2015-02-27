/*jslint node: true */
/*jslint nomen: true */
/*jslint es5: true */
"use strict";

var path = require('path');
var express = require('express');
var auth = require('./auth');
var lib = require('./lib');
var list = require('./list');
var router = express.Router();

router.use('/lib', lib);
router.use(express.static(path.join(__dirname, '../dist/')));

router.get('/', function (req, res) {
	res.render('index');
});
router.get('/monitor', function (req, res) {
	res.render('monitor');
});
router.get('/admin', function (req, res) {
	res.render('admin');
});
router.get('/video', function (req, res) {
	res.render('video');
});

router.use(auth);
router.use('/list', list);
router.get('/:address/monitor/*', function (req, res) {
	res.redirect('http://' + req.socket.localAddress + ':3000' + req.originalUrl);
});

module.exports = router;
