/*global $, jQuery, alert*/
/*global URL_CONFIGLIST, list, alert*/
            
(function () {
    "use strict";
    var grouplist;
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
                        
        });
    });
}());