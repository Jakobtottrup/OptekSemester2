/**
 * Created by jakobtottrup on 25/04/2017.
 */

function getUsersData() {
    return $.ajax({
        type: 'GET',
        url: "/api/users/admin",
        dataType: "json"
    }).done(function(data){
        usersData = data;
    });
}
$.when(getUsersData().done(function(){
    console.log("data received!");
}));
