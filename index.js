var express = require('express');
var app = express();
var route = require('./route')(app);

var server = app.listen(8000);

process.on('SIGINT', function() {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
	server.close();
	process.exit();
});
