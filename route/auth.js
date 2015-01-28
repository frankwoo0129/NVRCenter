/*jslint node: true */
"use strict";

var express = require('express');
var root = express.Router();

var auth = function (user, password) {
    if (user === 'guest' && password === 'guest1234!!') {
        return true;
    } else {
        return false;
    }
};

root.get('/auth', function (req, res) {
	if (typeof req.query.logout === 'string') {
		delete req.session.user;
		res.status(200).json({msg: 'logout'});
    } else if (req.session.user) {
		res.status(200).json({user: req.session.user});
    } else {
		res.status(401).json({msg: 'no auth'});
    }
});

root.post('/auth', function (req, res) {
	var user = req.body.user,
        password = req.body.password;
	
	if (auth(user, password)) {
		req.session.user = user;
		res.status(200).json({user: user});
	} else {
		res.status(401).json({msg: 'no auth'});
    }
});

root.use(function (req, res, next) {
	if (!req.session.user) {
		next('no auth');
    } else {
		next();
    }
});

module.exports = root;
