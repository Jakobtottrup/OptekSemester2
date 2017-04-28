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
function deleteUser(id) {
    //console.log(deleteUserId);
    $.ajax({
        type: 'DELETE',
        url: '/admins/users/' + id,
        dataType: 'json'
    });
}
function updateUser(id) {
    $.ajax({
        type: 'PUT',
        url: '/admins/users/' + id,
        dataType: 'json'
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
            "<td>" + usersData[i].steam + "</td>"+
            "<td>" + usersData[i].isAdmin + "</td>"+
            "<td>" + usersData[i].hasPaid + "</td>"+
            "<td>" + usersData[i].isActive + "</td></tr>");
    }

    $(function () {
        $('.user_checkbox').click(function () {
            if ($(this).is(':checked')) {
                $(':button').prop('disabled', false);
                deleteUserId.push(usersData[$(this).closest('tr').find('td:eq(2)').text()]);
                selected.push($(this).closest('tr').find('td:eq(2)').text());
            } else {
                $(':button').prop('disabled', true);
            }
        })
    });
}));

$(function () {
    $("#paidBtn").click(function () {
    });
});

//============ Checkbox kontrol===================
$(function () {
    $('#selectAll').click(function (e) {
        if ($(this).is(':checked')) {
            $(':button').prop('disabled', false);
        } else {
            $(':button').prop('disabled', true);
        }
        var table = $(e.target).closest('table');
        $('td :checkbox', table).prop('checked', this.checked);
        $('.user_checkbox').each(function () {
            deleteUserId.push(usersData[$(this).closest('tr').find('td:eq(2)').text()]);
            selected.push($(this).closest('tr').find('td:eq(2)').text());
        });
    });
});
// ===================== Make admin button ========================
$(function() {
    $('#makeAdminBtn').click(function() {
        for (i = 0; i < deleteUserId.length; i++) {
            updateUser(deleteUserId[i]._id);
        }
        location.reload(true);
    });
})


// ===================== Remove User Button ======================= //
$(function () {
    $('#removeUserBtn').click(function (e) {
        /*console.log(deleteUserId[i]._id);*/
        alert("Are you sure you wish to delete selected users?"); //todo: enable dobbelt-check på user delete
        for (i = 0; i < deleteUserId.length; i++) {
            deleteUser(deleteUserId[i]._id);
        }
        $(':checkbox').prop('checked', false);
        var table = $(e.target).closest('table');
        selected = [];
        deleteUserId = [];
        location.reload(true);
    })
});