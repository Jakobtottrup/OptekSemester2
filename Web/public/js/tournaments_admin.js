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
        output += "<td>" + (key+1) + "</td>";
        output += "<td><b>" + data.name + "</b></td>";
        output += "<td>Start: " + data.begintime + "<br>Slut: " + data.endtime + "</td>";
        output += "<td><input class='btn btn-primary' type='button' value='Se beskrivelse' onclick='showTourDescription(this)'/></td>";
        output += "<td><input class='btn btn-primary' type='button' value='Se billede' onclick='showPic(this)'/></td>";
        output += "<td>Max antal: "+ data.max_teams +"<br>Tilmeldte: "+ data.teams.length +"</td><br>";
        output += "<td><input class='btn btn-primary' type='button' value='Se deltagere' onclick='showMembers(this)'/></td>";
        output += "<td>" + prizes(data.prices) + "</td>";
        output += "</tr>";
    });
    output += "";
    $('#data_insert').append(output);
});


//show tournament description
function showTourDescription(source){
    getID(source);
}


function getID(source){
    var id = $(source).closest("tr").prop("id");
    console.log(id);
    return id;
}


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



function editTournament(data){


}