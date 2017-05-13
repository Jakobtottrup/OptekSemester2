/**
 * Created by Christian Skjerning on 5/6/2017.
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
    }).done(function(data){
        usersData = data;
    });
}

// get tournamnet data
function getTourData() {
    return $.ajax({
        type: 'GET',
        url: "/api/tournaments",
        dataType: "json"
    }).done(function(data){
        tourData = data;
    });
}

// get current user's data
function getUserData(){
    return $.ajax({
        type: 'GET',
        url: "/api/localuser",
        dataType: "json"
    }).done(function(data){
        userData = data;
    });
}


// get seatgroup data
function getGroupData(){
    return $.ajax({
        type: 'GET',
        url: "/api/seatgroups",
        dataType: "json"
    }).done(function(data){
        groupData = data;
    });
}


// find username using ID
function findUserName(id) {
    var user = $.grep(usersData, function (usersData) {
        user = usersData._id === id;
        return user;
    });
    if (typeof user[0] === "object"){
        return user[0].username;

    /*} else if (typeof user[0] === "") {
        return "Argument is not a proper ID";
*/
    } else if (typeof user[0] === "undefined") {
        return "ID was not found within users";
    }
}


// used for translating boolean into plain text
function translateBoolean(statement){
    if (statement) {
        return "Ja"; // true
    } else {
        return "Nej"; // false
    }
}


// used to display loading screen
$(document).ajaxStart(function() {
    if($.active > 0) {
        $('#loader').show();
    }
});
$(document).ajaxComplete(function() {
    $('#loader').hide();
});



// highlights active dashboard menu
$(document).ready(function(){
    var path = window.location.pathname;
    $("#dashboard-nav").find('a[href$="' +path+ '"]').parent().addClass("active");
});


function socialInfo(data){
    let output = "";
    if (data.steam || data.bnet) {
        if (data.steam){
            output += "<img src='https://steamstore-a.akamaihd.net/public/shared/images/responsive/share_steam_logo.png'> " + data.steam;
        } else {
            output += "<img src='https://steamstore-a.akamaihd.net/public/shared/images/responsive/share_steam_logo.png'> (Ikke angivet)"
        }
        if (data.bnet) {
            output += "<br><img src='https://maxcdn.icons8.com/Share/icon/Logos//battle_net1600.png'> " + data.bnet;
        } else {
            output += "<img src='https://maxcdn.icons8.com/Share/icon/Logos//battle_net1600.png'> (Ikke angivet)"
        }
    } else {
        output = "(Intet angivet)";
    }
    return output;
}
