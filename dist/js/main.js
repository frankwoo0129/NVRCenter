/*global $, jQuery, alert*/
/*global hideMultiCamera, function, alert*/
/*global hideSingleCamera, function, alert*/

(function () {
    'use strict';
    var URL_AUTH = "./auth";

    function checklogin(callback) {
        $.getJSON(URL_AUTH, function (data) {
            $('#login').modal('hide');
            if (callback && typeof callback === 'function') {
                callback();
            }
        }).fail(function () {
            $('#login').modal('show');
        });
    }

    function init() {
        $('header #navbar a[href="#monitor"]').tab('show');
    }

    $('#navbar a').click(function (e) {
        e.preventDefault();
        var self = $(this);
        checklogin(function () {
            self.tab('show');
        });
    });

    $('#navbar a').on('show.bs.tab', function (e) {
        //	alert($(e.target.hash).attr('id') + ' show');
        var timestamp = Math.floor(+new Date());
        $(e.target.hash).load($(e.target.hash).attr('id') + '?ts=' + timestamp);
    });

    $('#navbar a').on('hide.bs.tab', function (e) {
        if (e.target.hash === '#monitor') {
            hideMultiCamera();
            hideSingleCamera();
        }
        $(e.target.hash).html("");
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
        $('#login form').submit(function (e) {
            e.preventDefault();
            var formdata = {};
            formdata.user = $('form #inputUser').val();
            formdata.password = $('form #inputPassword').val();
            $.post(URL_AUTH, formdata, function (data) {
                $('#login').modal('hide');
                init();
            }).fail(function () {
                $('#login').modal('show');
            });
        });
        checklogin();
    });
}());