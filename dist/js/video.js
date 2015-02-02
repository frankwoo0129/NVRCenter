/*global $, jQuery, alert*/
/*global videojs, videojs, alert*/
/*global URL_CONFIGLIST, list, alert*/

(function () {
    "use strict";
    
    var URL_VIDEOLIST = "./Servlet/GetVideoServlet",
        selectedNode = null,
        grouplist;

    function loadEvent() {
        var view = $('#calendar').fullCalendar('getView'),
            url;
        
        if (view && view.name === 'basicDay' && selectedNode) {
            url = URL_VIDEOLIST + "/" + selectedNode.address + "/" + view.start.format('YYYYMMdd') + "/0000/2400";
            $.getJSON(url, function (data) {
                if (data.code === 200) {
                    data.list.forEach(function (obj, index, list) {
                        var event = {title: obj.title, start: view.start};
                        $('#calendar').fullCalendar('renderEvent', event);
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
            });
        }
    }
    
    
    $.getJSON(URL_CONFIGLIST, function (data) {
        grouplist = [];
        data.forEach(function (obj, index, list) {
            var group = {};
            group.text = obj.group;
            group.selectable = false;
            group.nodes = [];
            obj.list.forEach(function (innerobj, innerindex, innerlist) {
                var camera = {};
                camera.text = innerobj.title;
                camera.number = innerobj.number;
                camera.model = innerobj.model;
                camera.address = innerobj.address;
                camera.group = obj.group;
                camera.selectable = true;
                group.nodes.push(camera);
            });
            grouplist.push(group);
        });
    }).fail(function (data) {
        if (data.responseJSON) {
            alert(JSON.stringify(data.responseJSON));
        } else {
            alert("Server Error");
        }
    }).complete(function () {
        if (grouplist.length === 0) {
            alert("No IPCamera");
        }
        $('#treelist').treeview({data: grouplist, levels: 0});
        $('#treelist').on('nodeSelected', function (event, node) {
            selectedNode = node;
            $('#calendar').fullCalendar('removeEvents');
            loadEvent();
        });
        $('#calendar').fullCalendar({
            header: {
                left:   'prev,next',
                center: 'title',
                right:  'today month'
            },
            selectable: true,
            select: function (start, end) {
                $('#calendar').fullCalendar('gotoDate', start);
                $('#calendar').fullCalendar('changeView', 'basicDay');
            },
            viewRender: function (view, element) {
                loadEvent();
            },
            viewDestroy: function (view, element) {
                $('#calendar').fullCalendar('removeEvents');
            }
        });
        
    });
}());