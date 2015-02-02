/*jslint node: true */
/*jslint nomen: true */

"use strict";

var path = require('path');
var http = require('http');
var express = require('express');

var auth = require('./auth');
var lib = require('./lib');

module.exports = function (app) {
	app.use('/lib', lib);
	app.use(express.static(path.join(__dirname, '../dist/')));
	
    app.get('/', function (req, res) {
		res.render('index');
	});
	    
    app.get('/monitor', function (req, res) {
		res.render('monitor');
	});
    
    app.get('/admin', function (req, res) {
        res.render('admin');
    });
    
    app.get('/video', function (req, res) {
        res.render('video');
    });
	    
    app.use(auth);
    
    app.get('/list', function (req, res) {
        var options = {
            port: 3000,
            path: req.url,
            method: 'GET'
        };
        
        http.request(options, function (res_from_service) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            res_from_service.setEncoding('utf8');
            res_from_service.on('data', function (chunk) {
                var obj = JSON.parse(chunk),
                    all = {},
                    list = [],
                    ret = [],
                    i;
                                
                // Group
                all.group = 'all';
                for (i = 0; i < 1; i = i + 1) {
                    Object.keys(obj).forEach(function (address) {
                        var o = {};
                        o.address = address;
                        o.title = obj[address].title;
                        list.push(o);
                    });
                }
                all.list = list;
                ret.push(all);
                res.json(ret);
            });
        }).end();
    });
    
    app.get('/monitor/:address/*', function (req, res) {
        var options = {
            port: 3000,
            path: req.url,
            method: 'GET'
        };
        
//        http.request(options, function (res_from_service) {
//            res_from_service.on('data', function (chunk) {
//                res.send(chunk);
//            });
//        }).end();
        
        res.redirect('http://172.18.2.168:3000' + req.url);
    });
    
};