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
    var output = "<tr class='data_row'>";
    $.each(tournamentsData, function(key, data){
            output += "<tr class='data_row'>";
            output += "<td>" + (key+1) + "</td>";                                                                                               // index
            output += "<td><b>" + data.name + "</b></td>";                                                                                      // navn
            output += "<td>Start: " + data.begintime + "<br>Slut: " + data.endtime + "</td>";                                                   // start/slut
            output += "<td><input class='btn btn-primary' type='button' value='Se beskrivelse' onclick='showTourDescription(data.description)'/></td>";    // beskrivelse TODO
            output += "<td>" + key + "</td>";                                                                                                   // billede
            output += "<td>Max antal: "+ data.max_teamsize +"<br>Min antal: "+ data.min_teamsize +"</td><br>";                                  // hold
            output += "<td>" + translateBoolean(data.isOpen) + "</td>";                                                                         // åben for tilmelding
            output += "<td>" + prizes(data.prices) + "</td>";                                                                                   // præmier
            output += "</tr>";
    });
    output += "";
    $('#data_insert').append(output);
});

// convert true, false to Ja, Nej
function translateBoolean(data){
    if (data){
        return "Ja";
        //return "<div class='user_checkbox'></div>";
    } else {
        return "Nej";
        //return "<div class='user_checkbox'></div>";
    }
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
function showMembers(){


}

//show tournament description
function showTourDescription(data){
    console.log(data);
    // return '<input id="clickMe" type="button" value="clickme" onclick="showTourDescription(data.description)"/>';
}