/*jslint node: true */
"use strict";

var http = require('http');
var express = require('express');
var root = express.Router();

root.get('/', function (req, res) {
	var req_to_service,
		options = {
			port: 3000,
			path: req.originalUrl,
			method: 'GET'
		};
	
	req_to_service = http.request(options, function (res_from_service) {
//		console.log('STATUS: ' + res.statusCode);
//		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res_from_service.setEncoding('utf8');
		res_from_service.on('data', function (chunk) {
//			console.log(chunk);
			var obj = JSON.parse(chunk),
				all = {},
				list = [],
				ret = [];
			
			all.group = 'all';
			Object.keys(obj).forEach(function (address) {
				var o = {};
				o.address = address;
				o.title = obj[address].title;
				list.push(o);
			});
			all.list = list;
			ret.push(all);
			res.json(ret);
		});
	});
			
	req_to_service.on('error', function (e) {
		res.status(500).json({msg: 'Server Error'});
	});
		
	req_to_service.end();
});

module.exports = root;
