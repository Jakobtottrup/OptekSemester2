/**
 * Created by chris on 26-04-2017.
 */




function getTournamentsData(){
    return $.ajax({
        type: 'GET',
        url: "/api/tournaments",
        dataType: "json"
    }).done(function(data){
        tournamentsData = data;

    });
}


$.when(document, getTournamentsData()).done(function(){
    console.log(tournamentsData);
    var output = "<tr class='data_row'>";
    $.each(tournamentsData, function(key, data){
            output += "<tr class='data_row'>";
            output += "<td>" + (key+1) + "</td>";   // index
            output += "<td>" + data.name + "</td>"; // navn
            output += "<td>Start: " + data.begintime + "<br>Slut: " + data.endtime + "</td>";       // start/slut
            output += "<td>" + key + "</td>";       // beskrivelse
            output += "<td>" + key + "</td>";       // billede
            output += "<td>Max antal: " + data.max_teamsize +"<br>Min antal: "+ data.min_teamsize + "</td>";       // hold
            output += "<td>" + translateBoolean(data.isOpen) + "</td>";       // åben for tilmelding
            output += "<td>" + prizes(data.prices) + "</td>";       // præmier
            output += "</tr>";
    });
    output += "";
    $('#data_insert').append(output);


});

function translateBoolean(boo){
    if (boo){
        return "Ja";
    } else {
        return "Nej";
    }
}

function prizes(sort){
    console.log(sort);
    /*for(i=0; i<sort.length; i++){

    }
    return sort[i]+"Plads";
    */
}

