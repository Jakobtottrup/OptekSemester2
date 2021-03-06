/**
 * Created by chris on 26-04-2017.
 */


function openModal(){
    // make sure prizes are reset
    removePrize(); removePrize(); removePrize();

    // clear input fields
    $(":input").not(".btn").val("");

    // remove buttons
    $("#submit-div").find("input").remove();
    $("#submit-div").find("button").remove();

    // append button
    $("#submit-div").append("<button class='btn btn-danger' onclick='closeModal()'>Annuller</button>");
    $("#submit-div").append("<input type='submit' name='submit' value='Opret' class='btn btn-success btn-lg'>");


    // open modal
    $("#modal-create").modal("show");
}

function closeModal() {
    $(":input").not(".btn").val("");
    removePrize(); removePrize(); removePrize();
    $("#modal-create").modal("hide");
}

// list tournaments
$.when(document, getTournamentsData(), getUsersData()).done(function(){
    let output = "";
    $.each(tournamentsData, function(key, data){
        output += "<tr class='data_row "+data.isVisibel+" "+data.isOpen+"' id='"+data._id+"'>";
        output += "<td class='hidden-xs hidden-sm hidden-md'>" + (key+1) + "</td>";
        output += "<td><b>" + data.name + "</b></td>";
        output += "<td><b>Åbner: </b>" + convertTimeNoYear(data.openingDate) + "<br><b>Lukker: </b>" + convertTimeNoYear(data.closingDate) + "<br><b>Start: </b>" + convertTimeNoYear(data.startDate) + "<br><b>Varighed: </b>" + convertTimeNoYear(data.tourDuration) + "</td>";
        output += "<td class='hidden-xs hidden-sm hidden-md'><button class='btn btn-primary' onclick='showTourDescription(this)'>Se beskrivelse</button></td>";
        output += "<td class='hidden-xs hidden-sm hidden-md'><button class='btn btn-primary' onclick='showPic(this)'>Se billede</button></td>";
        output += "<td class='hidden-xs hidden-sm hidden-md'><b>Max hold: </b>"+ convertMember(data.maxTeams) +"<br><b>Pr. hold: </b>"+ convertMember(data.minTeamSize) + " - " + convertMember(data.maxTeamSize) +" deltagere</td><br>";
        output += "<td><button class='btn btn-primary' data-toggle='confirmation' onclick='showMembers(this)'>"+data.teams.length+" deltagende hold</button></td>";
        output += "<td>" + prizes(data.prizes) + "</td>";
        output += "<td class='hidden-xs hidden-sm hidden-md'><button class='btn btn-primary' onclick='editTournament(this)' style='width:100px; margin:3px'>Redigér</button><br><button class='btn btn-danger' data-toggle='confirmation' onclick='deleteTournamnet(this)' style='width:100px; margin:3px'>Slet</button></td>";
        output += "</tr>";
    });
    output += "";
    $('#data_insert').append(output);
});


// convert hold
function convertMember(data){
    if (data === null) {
        return "Intet angivet";
    }
    return data;
}

// stack prices
function prizes(data){
    if (data.length > 0) {
        let output = "";
        $.each(data, function (key, data) {
            output += "<b>#" + (data.p_index + 1) + ": </b>";
            output += "" + data.p_name + "";
            output += "<br>";
        });
        return output;
    } else {
        return "<b>Ingen præmier angivet!</b>";
    }
}

// show tournaments description
function showTourDescription(source){
    let tour_id = $(source).closest("tr").prop("id");   // get ID of table row
    let tour = $.grep(tournamentsData, function(tour){  // search for id property in objects
        return tour._id === tour_id;    // and return array index for found object
    });

    if (tour.length === 0) {
        window.alert("En fejl er opstået - Ingen beskrivelse blev fundet.");
    } else {
        $("#show-data-header").empty().append(tour[0].name);    // append tournaments name into header
        $("#show-data-body").empty().append(tour[0].description);   // append description into body
        $('#modal-edit').modal('show'); // show modal
    }
}
// preview image on upload
let loadFile = function(source) {
    let output = $(source).closest("td").prop("id");
    let id = output.substring(11,Infinity);
    let result = document.getElementById("image"+id);
    result.src = URL.createObjectURL(event.target.files[0]);
};

// prize control for new tournaments
let totalPrizes = 0;
function addPrize(){
    // if ($('input[id^=prize]').length < 7) {
    if (totalPrizes < 3) {
        totalPrizes++;
        // console.log(totalPrizes);
        $("#prize-head").append('<td id="prize_head'+totalPrizes+'">'+totalPrizes+'. Plads</td>');
        $("#prize-name").append('<td id="prize_name'+totalPrizes+'"><input type="text" class="form-control" maxlength="200" placeholder="Navn" name="prize_name" required></td>');
        $("#prize-info").append('<td id="prize_info'+totalPrizes+'"><input type="text" class="form-control" maxlength="200" placeholder="Beskrivelse" name="prize_info" required></td>');
        $("#prize-image").append('<td id="prize_image'+totalPrizes+'"><label class="btn btn-primary" style="width:100%">Vælg billede&hellip;<input name="prize_image" type="file" accept="image/*" onchange="loadFile(this)" style="display:none;"required></label>' +
            '<br><img id="image'+totalPrizes+'" style="width:100%; margin-top:10px"/></td>');
    }
}
function removePrize(){
    if (totalPrizes >= 1){
        $("#prize-head").find("#prize_head"+totalPrizes).remove();
        $("#prize-name").find("#prize_name"+totalPrizes).remove();
        $("#prize-info").find("#prize_info"+totalPrizes).remove();
        $("#prize-image").find("#prize_image"+totalPrizes).remove();
        totalPrizes--;
    }
}

// append members in tournaments into bootstrap modal
function showMembers(source){
    let tour_id = $(source).closest("tr").prop("id");
    let tour = $.grep(tournamentsData, function(tour){
        return tour._id === tour_id;
    });
    $("#show-data-body").empty();

    // match ID's with names in users collection
    if (tour[0].teams.length > 0) {
        $.each(tour[0].teams, function (key, data) {
            $("#show-data-body").append("Hold: <b>" + data.t_name + "</b>").append("<br>");

            for (i = 0; i < data.members.length; i++) {
                let user = $.grep(usersData, function (usersData) {
                    return usersData._id === data.members[i];
                });
                $("#show-data-body").append(findUserName(data.leaderID)+" (leder)").append("<br>");
                $("#show-data-body").append(user[0].username).append("<br>");
            }
            $("#show-data-body").append("<br>");
        });
        $("#show-data-header").empty().append("Hold for turnering: "+tour[0].name);
        $('#modal-edit').modal('show');
    } else {
        window.alert("Ingen deltagere på nuværende tidspunkt")
    }
}

// append image into bootstrap modal
function showPic(source){
    let tour_id = $(source).closest("tr").prop("id");   // get ID of table row
    let tour = $.grep(tournamentsData, function(tour){  // search for id property in objects
        return tour._id === tour_id;    // and return array index for found object
    });

    if (tour.length === 0) {
        window.alert("En fejl er opstået - Intet billede blev fundet.");
    } else {
        $("#show-data-header").empty().append(tour[0].name);    // append tournaments name into header
        $("#show-data-body").empty().append("<img src='"+tour[0].coverImage+"'style='width:100%'/>");   // append description into body
        $('#modal-edit').modal('show'); // show modal
    }
}


// delete tournaments
function deleteTournamnet (source) {
    let tour_id = $(source).closest("tr").prop("id");
    let delTour = confirm("Vil du slette denne turnering?");
    if(delTour === true) {
        $.ajax({
            type: 'DELETE',
            url: '/admins/tournaments/' + tour_id,
            dataType: 'json'
        });
        location.reload(true);
    }
}

// filter tournaments
function sortTournaments() {
    // Declare variables
    let input, filter, table, tr, td, i;
    input = document.getElementById("search-field");
    filter = input.value.toUpperCase();
    table = document.getElementById("tournament-table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// used to display filenames in input  - some default bootstrap
$(function() {
    // We can attach the `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function() {
        let input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    // We can watch for our custom `fileselect` event like this
    $(document).ready( function() {
        $(':file').on('fileselect', function(event, numFiles, label) {

            let input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' filer valgt' : label;

            if( input.length ) {
                input.val(log);
            } else {
                if( log ) alert(log);
            }
        });
    });
});


// edit tournaments
function editTournament(source){
    window.alert("Denne funktionen er ikke færdiggjort");
    openModal();
    $("#submit-div").find("input").remove();
    //$("#submit-div").append("<button class='btn btn-lg btn-success' onclick='updateTournament()'>Gem ændringer</button>");
    $("#submit-div").append("<input type='submit' name='submit' value='Gem ændringer' class='btn btn-success btn-lg'>");
    $("#input_form").attr("action", "/admins/tourupdate");

    let tour_id = $(source).closest("tr").prop("id");
    $("#tour_id").val(tour_id);

    // push correct info into modal
    for (let i = 0; i < tournamentsData.length; i++){
        if(tournamentsData[i]._id === tour_id){
            $("#input_name").val(tournamentsData[i].name);
            $("#tour_info").val(tournamentsData[i].description);
            $("#opening_date").val(formatDate(tournamentsData[i].openingDate));
            // $("#opening_date").datepicker('setDate', tournamentsData[i].openingDate);
            $("#closing_date").val(tournamentsData[i].closingDate);
            $("#start_date").val(tournamentsData[i].startDate);
            $("#tour_duration").val(tournamentsData[i].tourDuration);
            $("#visibility").val(tournamentsData[i].isVisibel);
            $("#team_size").val(tournamentsData[i].maxTeams);
            $("#team_minsize").val(tournamentsData[i].minTeamSize);
            $("#team_maxsize").val(tournamentsData[i].maxTeamSize);

            for (let j=0;j<tournamentsData[i].prizes.length; j++){
                addPrize();
                $("#prize_name"+(j+1)).children(".form-control").val(tournamentsData[i].prizes[j].p_name);
                $("#prize_info"+(j+1)).children(".form-control").val(tournamentsData[i].prizes[j].p_description);
            }
        }
    }
}


function updateTournament() {
    console.log("capture info")



}


function formatDate(date) {
    date = new Date(date);
    console.log(date);
    let year = date.getYear();
    let month = date.getMonth();
    let day = date.get();
    console.log(day, month, year);


    return day + "/" + month + "/" + year;
}