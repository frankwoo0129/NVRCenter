/*global $, jQuery, alert*/

$(function () {
    "use strict";
    
    function checkCustomMinHeight() {
        if ($("#custom-content li").length > 0) {
            $("#custom-content").css("min-height", 0);
        } else {
            $("#custom-content").css("min-height", 100);
        }
    }
    
    function addActive(obj) {
        obj.off("click");
        obj.click(function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            } else {
                $(this).addClass("active");
            }
        });
    }
    
    function addToCustom(obj) {
        var newObj = obj.clone();
        newObj.appendTo("#custom-content");
        newObj.off('dblclick');
        addActive(newObj);
        newObj.dblclick(function () {
            $(this).remove();
            $("#custom-content").trigger('contentChanged');
        });
    }
    
    $("body").disableSelection();

    $("#source .panel-heading").draggable({
        delay: 100,
        helper: "clone",
        zIndex: 1000,
        revert: "invalid",
        connectToSortable: "#custom-content",
        start: function (event, ui) {
            $(ui.helper).width($(ui.helper).parent().find(".panel-heading").width());
        }
    });
	
    $("#source .list-group-item").draggable({
        delay: 100,
        helper: "clone",
        start: function (event, ui) {
            $(ui.helper).width($(ui.helper).parent().find(".list-group-item").width());
            $(ui.helper.prevObject).removeClass("active");
            $(ui.helper).removeClass("active");
        },
        stop: function (event, ui) {
            addActive($(".list-group-item"));
        },
        revert: "invalid",
        zIndex: 1000,
        connectToSortable: "#custom-content"
    });

    var itemRemoved = false;
    
    $("#custom-content").sortable({
        delay: 100,
        out: function () {
            itemRemoved = true;
            $("#custom-content").removeClass("content-active");
        },
        over: function () {
            itemRemoved = false;
            $("#custom-content").addClass("content-active");
        },
        beforeStop: function (event, ui) {
            if (itemRemoved) {
                ui.item.remove();
                itemRemoved = false;
                $("#custom-content").trigger('contentChanged');
            }
        },
        stop: function (event, ui) {
            $(ui.item).dblclick(function () {
                $(this).remove();
                $("#custom-content").trigger('contentChanged');
            });
        },
        receive: function (event, ui) {
            if ($(ui.item).hasClass("panel-heading")) {
                addToCustom($(ui.item).closest(".panel").find("li"));
                $("#custom-content .panel-heading").remove();
            }
            $("#custom-content").trigger('contentChanged');
        },
        deactivate: function (event, ui) {
            checkCustomMinHeight();
        }
    }).disableSelection();

    $("#custom-content").on('contentChanged', function () {
        $(".list-group-item.active").removeClass("active");
        checkCustomMinHeight();
    });

    $("#source .list-group-item").dblclick(function () {
        addToCustom($(this));
        $("#custom-content").trigger('contentChanged');
    });
    
    $("#source .panel-heading").dblclick(function () {
        addToCustom($(this).closest(".panel").find(".list-group-item"));
        $("#custom-content").trigger('contentChanged');
    });
    
    $("#import").click(function () {
        addToCustom($("#source .list-group-item.active"));
        $("#custom-content").trigger('contentChanged');
    });
    
    $("#importAll").click(function () {
        addToCustom($("#source .list-group-item"));
        $("#custom-content").trigger('contentChanged');
    });
    
    $("#export").click(function () {
        $("#custom-content .active").remove();
        $("#custom-content").trigger('contentChanged');
    });
    
    $("#exportAll").click(function () {
        $("#custom-content .list-group-item").remove();
        $("#custom-content").trigger('contentChanged');
    });
    
    addActive($(".list-group-item"));
});
