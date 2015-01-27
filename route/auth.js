var express = require('express');
var root = express.Router();

root.get('/', function(req, res) {
	var user = req.query.user;
	var password = req.query.password;
});
