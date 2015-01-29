/*global $, jQuery, alert*/
/*global videojs, videojs, alert*/

(function () {
    'use strict';

    var URL_CONFIGLIST = "./list",
        URL_JPEG = "./monitor/{address}/out.m3u8",
        modal_player,
        players = {},
        SIZE = 0,
        PAGE = 0;

    function showSingleCamera() {
        var address = $('.zoomin').find('.modal-header').attr('title'),
            video = $('<video id="modal_video" class="video-js vjs-default-skin" width="100%" autoplay><source src="' + URL_JPEG.replace("{address}", address) + '" type="application/x-mpegURL"></video>');
        $('.modal .modal-body').html(video);
        //$('#modal_video').height($('#modal_video').width() * 9 / 16);
        modal_player = videojs('modal_video', function () {
            this.play();
        });
    }

    function hideSingleCamera() {
        modal_player.dispose();
        modal_player = null;
    }

    function showMultiCamera(obj) {
        $('#' + obj.html() + ' .thumbnail').each(function () {
            var self = $(this),
                address = $(this).attr('id'),
                title = $(this).attr('title'),
                h5 = $('<h5>' + title + '</h5>');
                //video = $('<video id="video_' + address + '" class="video-js vjs-default-skin" width="100%" autoplay><source src="' + URL_JPEG.replace("{address}", address) + '" type="application/x-mpegURL"></video>');
            //self.html(video);
            self.append(h5);
            
//            if (self.is(':visible')) {
//                modal_player = videojs('video_' + address, function () {
//                    this.play();
//                });
//            }
        });
    }
    
    function hideMultiCamera() {
       // $('.thumbnail').each(function () {
            //var address = $(this).attr('id');
                //modal_player = videojs('video_' + address, function () {
                    //this.dispose();
                //});
            //$(this).html('');
        //});
        
//        Object.keys(players).forEach(function (key) {
//            delete players[key];
//        });
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

    $('#myTab .dropdown-menu a').click(function (e) {
        SIZE = $(this).attr('id');
        showPage(0, SIZE);
    });
    
    $('.pager .previous').click(function () {
        showPage(PAGE - 1, SIZE);
    });
    
    $('.pager .next').click(function () {
        showPage(PAGE + 1, SIZE);
    });
    
    $(document).ready(function () {
        $.getJSON(URL_CONFIGLIST, function (data) {
            if (data.code === 200) {
                data.list.forEach(function (obj, index, list) {
                    var li = $('<li role="presentation" class="pull-left"><a></a></li>'),
                        div = $('<div role="tabpanel" class="tab-pane"><div class="row"></div></div>');
                    li.find('a').html(obj.group);
                    li.find('a').attr('href', '#' + obj.group);
                    $('#myTab').append(li);
                    div.attr('id', obj.group);
                    obj.list.forEach(function (inner, innerindex, innerlist) {
                        var h5 = $('<h5></h5>'),
                            innerdiv = $('<div class="col-md-2"><a class="thumbnail" data-toggle="modal" data-target=".zoomin"></a></div>'),
                            jpeg = $('<img alt="...">');
                        h5.html(inner.title);
                        jpeg.attr('src', URL_JPEG.replace("{address}", inner.address));
                        innerdiv.find('a').attr('title', inner.title);
                        innerdiv.find('a').attr('id', inner.address);
                        //innerdiv.find('.thumbnail').append(jpeg);
                        //innerdiv.find('.thumbnail').append(h5);
                        div.find('.row').append(innerdiv);
                    });
                    
                    $('.container .tab-content').append(div);
                });
            } else {
                alert(JSON.stringify(data));
            }
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
            
            $('#myTab .pull-left a:last').tab('show');
            
            $('.thumbnail').click(function (e) {
                e.preventDefault();
                $('.zoomin .modal-title').html($(this).attr('title'));
                $('.zoomin .modal-header').attr("title", $(this).attr('id'));
            });
        });
    });
}());
