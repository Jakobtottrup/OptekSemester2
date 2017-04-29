/**
 * Created by chris on 26-04-2017.
 */

// ============== SHOWING ============== //
// retrieve data from database
function getTournamentsData(){
    return $.ajax({
        type: 'GET',
        url: "/api/tournaments",
        dataType: "json"
    }).done(function(data){
        tournamentsData = data;

    });
}

// retrieve data from database
function getUsersData(){
    return $.ajax({
        type: 'GET',
        url: "/api/users",
        dataType: "json"
    }).done(function(data){
        usersData = data;

    });
}

// list tournaments
$.when(document, getTournamentsData(), getUsersData()).done(function(){
    var output = "";
    $.each(tournamentsData, function(key, data){
        output += "<tr class='data_row "+data.isOpen+"' id='"+data._id+"'>";
        output += "<td>" + (key+1) + "</td>";
        output += "<td><b>" + data.name + "</b></td>";
        output += "<td><b>Åbner:</b> " + convertTime(data.openingDate) + "<br><b>Lukker:</b> " + convertTime(data.closingDate) + "<br><b>Start: </b>" +
                convertTime(data.startDate) + "<br><b>Varighed:</b> " + convertTime(data.tourDuration) + "</td>";
        output += "<td><input class='btn btn-primary' type='button' value='Se beskrivelse' onclick='showTourDescription(this)'/></td>";
        output += "<td><input class='btn btn-primary' type='button' value='Se billede' onclick='showPic(this)'/></td>";
        output += "<td>Max antal: "+ data.maxTeams +"<br>Tilmeldte: "+ data.teams.length +"</td><br>";
        output += "<td><input class='btn btn-primary' type='button' value='Se deltagere' onclick='showMembers(this)'/></td>";
        output += "<td>" + prizes(data.prizes) + "</td>";
        output += "</tr>";
    });
    output += "";
    $('#data_insert').append(output);
});

// used for warping time space into understandable text for human species
function convertTime(time){
    if (typeof time === "number"){
        if(time === 1) {
            return time+" time";
        } else {
            return time+" timer";
        }
    } else {
        var time = new Date(time);
        time.toString();
        return time;
    }
}

// stack prices
function prizes(data){
    var output = "";
    $.each(data, function(key, data){
        output += "#"+(data.p_index+1)+": ";
        output += ""+ data.p_description +"";
        output += "<br>";
    });
    return output;
}

//show tournament description
function showTourDescription(source){
    var tour_id = $(source).closest("tr").prop("id");   // get ID of table row
    var tour = $.grep(tournamentsData, function(tour){  // search for id property in objects
        return tour._id === tour_id;    // and return array index for found object
    });

    if (tour.length === 0) {
        window.alert("En fejl er opstået - Ingen beskrivelse blev fundet.");
    } else {
        $("#show-data-header").empty().append(tour[0].name);    // append tournament name into header
        $("#show-data-body").empty().append(tour[0].description);   // append description into body
        $('#modal-edit').modal('show'); // show modal
    }
}


// show members in tournament
function showMembers(source){
    var tour_id = $(source).closest("tr").prop("id");
    var tour = $.grep(tournamentsData, function(tour){
        return tour._id === tour_id;
    });
    $("#show-data-body").empty();

    // match ID's with names in users collection
    if (tour[0].teams.length > 0) {
        $.each(tour[0].teams, function (key, data) {
            $("#show-data-body").append("<b>" + data.name + "</b>").append("<br>");

            for (i = 0; i < data.members.length; i++) {
                var user = $.grep(usersData, function (usersData) {
                    return usersData._id === data.members[i];
                });
                $("#show-data-body").append(user[0].username + " - " + user[0].email).append("<br>");
            }
            $("#show-data-body").append("<br>");
        });
        $("#show-data-header").empty().append(tour[0].name);
        $('#modal-edit').modal('show');
    } else {
        window.alert("Ingen deltagere fundet")
    }
}


function showPic(source){
    var tour_id = $(source).closest("tr").prop("id");   // get ID of table row
    var tour = $.grep(tournamentsData, function(tour){  // search for id property in objects
        return tour._id === tour_id;    // and return array index for found object
    });

    if (tour.length === 0) {
        window.alert("En fejl er opstået - Ingen beskrivelse blev fundet.");
    } else {
        $("#show-data-header").empty().append(tour[0].name);    // append tournament name into header
        $("#show-data-body").empty().append("<img src='"+tour[0].image+"'style='width:100%'/>");   // append description into body
        $('#modal-edit').modal('show'); // show modal
    }
}




// ============== EDIT ============== //
function editTournament(data){



}