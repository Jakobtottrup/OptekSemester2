/**
 * Created by jakobtottrup on 25/04/2017.
 */



var selected = [];
var deleteUserId = [];
var adminClicked = false;
var paymentClicked = false;
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
function updateUsers(id, adminClicked, paymentClicked) {
    console.log("testing hasPaid: "+paymentClicked);
    console.log("testing isAdmin: "+adminClicked);
    $.ajax({
        type: 'PUT',
        url: '/admins/users/' + id +"/"+ adminClicked + "/" + paymentClicked,
        dataType: 'json'
    });
}
/*function updateAdmin(id, isAdmin) {
    console.log("testing isAdmin: "+isAdmin);
    $.ajax({
        type: 'PUT',
        url: '/admins/users/' + id +"/"+ isAdmin,
        dataType: 'json'
    });
}*/
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
// ===================== Make admin button ========================
$(function() {
    $('#toggleAdminBtn').click(function() {
        adminClicked = true;
        paymentClicked = false;
        for (i = 0; i < deleteUserId.length; i++) {
            updateUsers(deleteUserId[i]._id, adminClicked, paymentClicked);
        }
       // paymentClicked, adminClicked = false;
        //location.reload(true);
    });
});

$(function () {
    $("#togglePaymentBtn").click(function () {
        paymentClicked = true;
        adminClicked = false;
        for (i=0;i<deleteUserId.length; i++) {
            updateUsers(deleteUserId[i]._id, adminClicked, paymentClicked);
        }
        //paymentClicked, adminClicked = false;
        //location.reload(true);
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