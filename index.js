/*jslint node: true */
/*jslint nomen: true */
"use strict";

var express = require('express'),
	hbs = require('hbs'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	cookieSession = require('cookie-session'),
	route = require('./route'),
	app = express(),
	server;

app.use(bodyParser.urlencoded({extended: true}));
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
app.use(route);

server = app.listen(1234);

function shutdown() {
	server.close();
	process.exit();
}

process.on('SIGINT', function () {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
	shutdown();
});
