/**
 * Created by Christian Skjerning on 5/6/2017.
 */
getEventData();
function getEventData(){
    return $.ajax({
        type: 'GET',
        url: "/api/event",
        dataType: "json"
    }).done(function(data){
        EventData = data;
        drawEventInfo();
    });
}


// get all users data
function getUsersData() {
    return $.ajax({
        type: 'GET',
        url: "/api/users",
        dataType: "json"
    }).done(function(data){
        usersData = data;
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
    //console.log($.active);
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


// event informations
function drawEventInfo() {
    $("#event_info_div").append("<li>Lokation: "+EventData[0].location+"</li>");
    $("#event_info_div").append("<li>Beskrivelse: "+EventData[0].description+"</li>");
    $("#event_info_div").append("<li>Pris: "+EventData[0].price+" DKK</li>");
    $("#event_info_div").append("<li>Der plads til "+EventData[0].maxGuests+" personer</li>");
}