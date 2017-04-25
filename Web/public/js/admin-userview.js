/**
 * Created by jakobtottrup on 25/04/2017.
 */

function getUsersData() {
    return $.ajax({
        type: 'GET',
        url: "/api/users",
        dataType: "json"
    }).done(function(data){
        usersData = data;
    });
}
$.when(getUsersData().done(function(){
    console.log("data received!");
    //TODO: Fjern efter test
}));


$(function () {
    $("#getUsersBtn").click(function () {
        console.log(usersData);
        $("#data_insert").empty();
        for (i = 0; i < usersData.length; i++) {
            $('#data_insert').append("<tr class='data_row clickable-row'>" +
                "<td><input type='checkbox' class='user_checkbox'></td>" +
                "<td>" + (i+1) + "</td>" +
                "<td>" + usersData[i].username + "</td>" +
                "<td>" + usersData[i].age + "</td>" +
                "<td>" + usersData[i].email + "</td>" +
                "<td>" + usersData[i].studie + "</td>" +
                "<td>" + usersData[i].fakultet + "</td>" +
                "<td>" + usersData[i].bnet + "</td>" +
                "<td>" + usersData[i].steam + "</td></tr>");
        }
    });
});
//Checkbox kontrol
$('#meta_checkbox').click(function(e){
    var table= $(e.target).closest('table');
    $('td input:checkbox',table).prop('checked',this.checked);
    if ($(this).is(':checked')) {

        $('#removeUserBtn').removeAttr('disabled'); //enable input

    } else {
        $('#removeUserBtn').attr('disabled', true); //disable input
    }/*
    $('#removeUserBtn').removeAttr('disabled');*/

});


$(function () {
   $('#removeUserBtn').click(function () {
       alert("Are you sure you wish to delete selected users?");
       console.log("Deleting user...");
   })
});