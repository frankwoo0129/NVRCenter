/*global $, jQuery, alert */
/*global console, alert */

var URL_AUTH = "./auth";
var URL_CONFIGLIST = "./list";

(function () {
	'use strict';
	
	function clearAllTimeout() {
		var id = window.setTimeout(function () {}, 0);
		while (id > 0) {
			// will do nothing if no timeout with id is present
			window.clearTimeout(id);
			id = id - 1;
		}
	}
	
	function init() {
		$('header #navbar a[href="#monitor"]').tab('show');
	}
	
	function checklogin(callback) {
		$.getJSON(URL_AUTH, function (data) {
			$('#login').modal('hide');
			if (callback && typeof callback === 'function') {
				callback();
			} else {
				init();
			}
		}).fail(function () {
			$('#login form').submit(function (e) {
				e.preventDefault();
				var formdata = {};
				formdata.user = $('form #inputUser').val();
				formdata.password = $('form #inputPassword').val();
				$.post(URL_AUTH, formdata, function (data) {
					$('#login').modal('hide');
					if (callback && typeof callback === 'function') {
						callback();
					} else {
						init();
					}
				}).fail(function () {
					alert("Auth ERROR");
					$('form #inputUser').val('');
					$('form #inputPassword').val('');
					$('#login').modal('show');
				});
			});
			$('#login').modal('show');
		});
	}
	
	$('#navbar a').click(function (e) {
		e.preventDefault();
		var self = $(this);
		checklogin(function () {
			self.tab('show');
		});
	});
	
	$('#navbar a').on('show.bs.tab', function (e) {
		var timestamp = Math.floor(+new Date());
		$(e.target.hash).load($(e.target.hash).attr('id') + '?ts=' + timestamp);
	});
	
	$('#navbar a').on('hide.bs.tab', function (e) {
		clearAllTimeout();
	});
	
	$('#logout').click(function () {
		$.getJSON(URL_AUTH + "?logout", function (data) {
		}).always(function () {
			location.reload();
		});
	});
	
	$('.modal').on('hidden.bs.modal', function (e) {
		checklogin();
	});
	
	$(document).ready(function () {
		checklogin();
	});
	
}());