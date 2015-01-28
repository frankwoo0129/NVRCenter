/*jslint node: true */
/*jslint nomen: true */
"use strict";

var express = require('express');
var hbs = require('hbs');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
	secret: 'NVRCenter',
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: 60000
	}
}));
app.set('view engine', 'html');
app.engine('html', hbs.__express);

var route = require('./route')(app);
var server = app.listen(8000);

process.on('SIGINT', function () {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
	server.close();
	process.exit();
});
