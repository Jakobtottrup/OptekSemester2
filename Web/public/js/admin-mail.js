/**
 * Created by jakobtottrup on 02/05/2017.
 */


/**
 * Sends GET request to router localhost:3000/api/users as admin
 * returns userdata in JSON format.
 */
function getUsersData() {
    return $.ajax({
        type: 'GET',
        url: "/api/users",
        dataType: "json"
    }).done(function (data) {
        usersData = data;
    });
}


/**
 * Function runs when getUserData() is finished loading.
 * - generates table with each row having unique id of row + i
 * - inserts each users' data into the table cells.
 */
$.when(getUsersData().done(function () {
    $("#data_insert").empty().append("<option>ALL UNPAID</option>").append("<option>ALL USERS</option>");
    for (i = 0; i < usersData.length; i++) {
        $('#data_insert').append("<option>"+usersData[i].email + "</option>");

    }
    for (i=0;i<usersData.length; i++){
        $('#all_users').append('<input type="text" name="all_user_emails" id="all_user_emails'+i+'" class="form-control hidden">');
        $("#all_user_emails"+i).val(usersData[i].email);
    }

    var unPaid = [];
    for (i = 0; i < usersData.length; i++) {
        if (usersData[i].hasPaid == false) {
            $('#unpaid_emails').append('<input type="text" name="emails" id="emails' + i + '" class="form-control hidden">');
            unPaid.push(usersData[i].email);
            $("#emails" + i).val(usersData[i].email);
        }
    }
    console.log(unPaid);
}));

/*
$('#reminder').click(function () {

});

$('#send_to_all').click(function () {

});*/
