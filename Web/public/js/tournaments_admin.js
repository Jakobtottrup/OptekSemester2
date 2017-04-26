/**
 * Created by chris on 26-04-2017.
 */



// gather data from database
function getTournamentsData(){
    return $.ajax({
        type: 'GET',
        url: "/api/tournaments",
        dataType: "json"
    }).done(function(data){
        tournamentsData = data;

    });
}

// list tournaments
$.when(document, getTournamentsData()).done(function(){
    var output = "";
    $.each(tournamentsData, function(key, data){
        output += "<tr class='data_row "+data.isOpen+"' id='"+data._id+"'>";
        output += "<td>" + (key+1) + "</td>";                                                                                                           // index
        output += "<td><b>" + data.name + "</b></td>";                                                                                                  // navn
        output += "<td>Start: " + data.begintime + "<br>Slut: " + data.endtime + "</td>";                                                               // start/slut
        output += "<td><input class='btn btn-primary' type='button' value='Se beskrivelse' onclick='showTourDescription(' +data.description+ ')'/></td>";     // beskrivelse TODO
        output += "<td><input class='btn btn-primary' type='button' value='Se billede' onclick='showPic(' +data.description+ ')'/></td>";                     // billede
        output += "<td>Max antal: "+ data.max_teams +"<br>Tilmeldte: "+ data.teams.length +"</td><br>";                                                 // hold
        output += "<td><input class='btn btn-primary' type='button' value='Se deltagere' onclick='showMembers(' +data.teams+ ')'/></td>";                     // medlemmer
        output += "<td>" + prizes(data.prices) + "</td>";                                                                                               // præmier
        output += "</tr>";
    });
    output += "";
    $('#data_insert').append(output);
});


// stack prices
function prizes(data){
    var output = "";
    $.each(data, function(key, data){
        output += "#"+(key+1)+": ";
        output += ""+ data.description +"";
        output += "<br>";
    });
    return output;
}


// see members of tournament
function showMembers(data){

}


function showPic(data){

}


//show tournament description
function showTourDescription(data){
    console.log(data);

}

function editTournament(data){


}