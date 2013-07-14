$(document).ready(function() {
    var ul_to_array = function(ul) {
        var arr = [];
        ul.find('li').each(function() {
            arr.push(parseInt($(this).text(), 10));
        });
        return arr;
    };
    
    var array_to_ul = function(ul, arr) {
        var sorted_container = $('<div>');
        for (var i in arr) {
            if (!arr.hasOwnProperty(i)) {
                continue;
            }
            sorted_container.append($('<li>').html(arr[i]));
        }
        ul.html(sorted_container.html());
    };
    var sortable_list = new SortableList(ul_to_array($('#sortable_list')));
    
    $('#sort_button').click(function(event) {
        sortable_list.merge_sort();
        array_to_ul($('#sortable_list'), sortable_list.list);
    });
    
    $('#randomize_button').click(function(event) {
        sortable_list.randomize();
        array_to_ul($('#sortable_list'), sortable_list.list);
    });
});