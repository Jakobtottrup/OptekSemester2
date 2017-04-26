/**
 * Created by jakobtottrup on 25/04/2017.
 */
var selected = [];
var deleteUserId = [];
function getUsersData() {
    return $.ajax({
        type: 'GET',
        url: "/api/users",
        dataType: "json"
    }).done(function (data) {
        usersData = data;
    });
}
function deleteUser() {
    console.log(deleteUserId);
     $.ajax({
        type: 'POST',
        url: '/admins/users'
    });
}
$.when(getUsersData().done(function () {

    $("#data_insert").empty();
    for (i = 0; i < usersData.length; i++) {
        $('#data_insert').append("<tr class='data_row' id='row" + i + "'>" +
            "<td hidden>" + usersData[i]._id + "</td>" +
            "<td><input type='checkbox' class='user_checkbox'></td>" +
            "<td>" + i + "</td>" +
            "<td>" + usersData[i].username + "</td>" +
            "<td>" + usersData[i].age + "</td>" +
            "<td>" + usersData[i].email + "</td>" +
            "<td>" + usersData[i].studie + "</td>" +
            "<td>" + usersData[i].fakultet + "</td>" +
            "<td>" + usersData[i].bnet + "</td>" +
            "<td>" + usersData[i].steam + "</td></tr>");
    }

    $(function () {
        $(':checkbox').click(function () {

            if ($(this).is(':checked')) {
                $(':button').prop('disabled', false);
                deleteUserId.push(usersData[$(this).closest('tr').find('td:eq(2)').text()]);
                selected.push($(this).closest('tr').find('td:eq(2)').text());
                //console.log($(this).closest('tr').find('td:eq(2)').text());
                //todo: fjern console.log

            } else {
                $(':button').prop('disabled', true);
            }
        })

    });
}));

$(function () {
    $("#paidBtn").click(function () {
        console.log("this button no longer does anything..")
        //todo: fjern console.log
    });
});

//Checkbox kontrol
$(function () {
    $('#selectAll').click(function (e) {
        var table = $(e.target).closest('table');
        $('td :checkbox', table).prop('checked', this.checked);
        $(':checkbox').each(function () {
            deleteUserId.push(usersData[$(this).closest('tr').find('td:eq(2)').text()]);
            selected.push($(this).closest('tr').find('td:eq(2)').text());
        });
    });
});


$(function () {
    $('#removeUserBtn').click(function (e) {
        deleteUser(deleteUserId);
        /*for (i = 0; i < deleteUserId.length; i++) {
            console.log(deleteUserId[i]._id);
        }*/
        //console.log(deleteUserId);

        $(':checkbox').prop('checked', false);
        var table = $(e.target).closest('table');
        //todo: enable dobbelt-check på user delete
        //alert("Are you sure you wish to delete selected users?");
        //console.log("Deleting users: " + selected);
        //todo: fjern console.log
        //alert("Press OK to reload");
        //location.reload(true);
        selected = [];
        deleteUserId = [];
        //console.log($("input:checkbox").prop('checked', $(this).prop("checked")));
        //todo: fjern console.log
        // $('td :checkbox', table).prop('checked', false);
        /*       $('#user_table').find('input[type="checkbox"]:checked').each(function () {
         console.log("Deleted user: " + $('#data_insert').children);
         //todo: fjern console.log

         });*/
    })
});