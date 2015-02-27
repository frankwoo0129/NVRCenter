/*global $, jQuery, alert*/
/*global videojs, videojs, alert*/
/*global URL_CONFIGLIST, list, alert*/
/*global InstallTrigger, firefox, alert*/
/*jslint plusplus: true */

(function () {
	'use strict';
	
	var URL_JPEG = "./{address}/monitor/out.m3u8",
		players = {},
		SIZE = 0,
		PAGE = 0,
		
		// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
		isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
		// Firefox 1.0+
		isFirefox = typeof InstallTrigger !== 'undefined',
		// At least Safari 3+: "[object HTMLElementConstructor]"
		isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
		// Chrome 1+
		isChrome = !!window.chrome && !isOpera,
		// At least IE6
		/*@cc_on@*/
		isIE = /*@true ||@*/ !!document.documentMode;
	
//	console.log('opera:' + isOpera);
//	console.log('firefox:' + isFirefox);
//	console.log('safari:' + isSafari);
//	console.log('chrome:' + isChrome);
//	console.log('IE:' + isIE);

	function clearAllTimeout() {
		var id = window.setTimeout(function () {}, 0);
		while (id > 0) {
			// will do nothing if no timeout with id is present
			window.clearTimeout(id);
			id = id - 1;
		}
	}

	function showSingleCamera() {
		var address = $('.zoomin').find('.modal-header').attr('title'),
			url = URL_JPEG.replace("{address}", address),
			video = $('<video id="modal_video" class="video-js vjs-default-skin" width="100%"><source type="application/x-mpegURL"></video>');
		
		video.find('source').attr('src', url);
		$('.modal .modal-body').html(video);
		videojs("modal_video").ready(function () {
			this.play();
			$('.video-js').height($('.video-js').width() * 9 / 16);
		});
	}

	function hideSingleCamera() {
		videojs("modal_video").dispose();
	}

	function showMultiCamera(obj) {
		var count = 0;
		$('#' + obj.html() + ' .thumbnail').each(function () {
			var n = count++,
				self = $(this),
				address = $(this).attr('address'),
				title = $(this).attr('title'),
				h5 = $('<h5>' + title + '</h5>'),
				video = $('<video id="video_' + n + '_' + address + '" class="video-js vjs-default-skin" width="100%"><source src="' + URL_JPEG.replace("{address}", address) + '" type="application/x-mpegURL"></video>');
			
			self.html(video);
			self.append(h5);
			videojs('video_' + n + '_' + address).ready(function () {
				this.play();
			});
		});

		$('.video-js').height($('.video-js').width() * 9 / 16);
	}

	function hideMultiCamera() {
		$('.thumbnail .video-js').each(function () {
			var id = $(this).attr('id'),
				player = videojs(id);

			player.dispose();
			$(this).parent('.thumbnail').html('');
		});
		clearAllTimeout();
	}

	function showPage(page, size) {
		if (size <= 1) {
			PAGE = 0;
			$('.container .tab-content .active .thumbnail').each(function (index) {
				$(this).parent().removeClass();
				$(this).parent().addClass("col-md-6");
				$(this).show();
			});
		} else if (page < 0) {
			showPage(0, size);
		} else {
			PAGE = page;
			var lower = size * (size - 1) * page,
				upper = size * (size - 1) * (page + 1),
				weight = 12 / size;
			if (lower === 0) {
				$('.pager .previous').addClass('disabled');
			} else {
				$('.pager .previous').removeClass('disabled');
			}
			
			if (upper > $('.container .tab-content .active .thumbnail').length) {
				$('.pager .next').addClass('disabled');
			} else {
				$('.pager .next').removeClass('disabled');
			}
			
			$('.container .tab-content .active .thumbnail').each(function (index) {
				$(this).parent().removeClass();
				$(this).parent().addClass("col-md-" + weight);
				if (index >= upper) {
					$(this).hide();
				} else if (index < lower) {
					$(this).hide();
				} else {
					$(this).show();
				}
			});
		}
	}

	$('.zoomin').on('show.bs.modal', function () {
		hideMultiCamera();
	});

	$('.zoomin').on('hide.bs.modal', function () {
		hideSingleCamera();
	});

	$('.zoomin').on('shown.bs.modal', function () {
		showSingleCamera();
	});
	
	$('.zoomin').on('hidden.bs.modal', function () {
		showMultiCamera($('#myTab .active a'));
	});

	$('.pager .previous').click(function () {
		showPage(PAGE - 1, SIZE);
	});

	$('.pager .next').click(function () {
		showPage(PAGE + 1, SIZE);
	});

	$.getJSON(URL_CONFIGLIST, function (data) {
		data.forEach(function (obj, index, list) {
			var li = $('<li role="presentation" class="pull-left"><a></a></li>'),
				div = $('<div role="tabpanel" class="tab-pane"><div class="row"></div></div>');
			
			li.find('a').html(obj.group);
			li.find('a').attr('href', '#' + obj.group);
			$('#myTab').append(li);
			div.attr('id', obj.group);
			obj.list.forEach(function (inner, innerindex, innerlist) {
				var innerdiv = $('<div class="col-md-2"><a class="thumbnail" data-toggle="modal" data-target=".zoomin"></a></div>');
				innerdiv.find('a').attr('title', inner.title);
				innerdiv.find('a').attr('address', inner.address);
				div.find('.row').append(innerdiv);
			});
			$('.container .tab-content').append(div);
		});
	}).fail(function (data) {
		if (data.responseJSON) {
			alert(JSON.stringify(data.responseJSON));
		} else {
			alert("Server Error");
		}
	}).always(function () {
		$('#myTab .pull-left a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});
		
		$('#myTab .pull-left a').on('shown.bs.tab', function () {
			showMultiCamera($(this));
			SIZE = 3;
			showPage(0, SIZE);
		});

		$('#myTab .pull-left a').on('hide.bs.tab', function () {
			hideMultiCamera();
		});
		
		$('#myTab .dropdown-menu a').click(function (e) {
			SIZE = $(this).attr('id');
			showPage(0, SIZE);
			$('.video-js').height($('.video-js').width() * 9 / 16);
		});

		$('#myTab .pull-left a:last').tab('show');
		
		$('.thumbnail').click(function (e) {
			e.preventDefault();
			$('.zoomin .modal-title').html($(this).attr('title'));
			$('.zoomin .modal-header').attr("title", $(this).attr('address'));
		});
		
		$('.video-js').height($('.video-js').width() * 9 / 16);
		
		$(window).resize(function () {
			$('.video-js').height($('.video-js').width() * 9 / 16);
		});
	});
}());