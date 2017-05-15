/**
 * Created by ste on 02-05-2017.
 */

// tour = false;

function getTourData(){
    return $.ajax({
        type: 'GET',
        url: "/api/tournaments",
        dataType: "json"
    }).done(function(data){
        tour = data;
    });
}

$.when(getTourData()).done(function() {
    showTours();
});

function showTours() {
    for (i = 0; i < tour.length; i++) {
        let output = "";
        output += "<div class='tour-div' id='"+tour[i]._id+"'>";
        output += "<div class='tour-title'><h2>" + tour[i].name + "</h2></div>";
        output += "<div class='tour-cover'><img src='" + tour[i].coverImage + "'></div>";
        output += "<button class='btn btn-success' onclick='openModal(this)'>Tilmeld turnering</button>";
        output += "<button class='btn btn-danger' onclick='leaveTournament(this)'>Afmeld turnering</button>";
        output += "<div class='tour-countdown'><p>Turneringen begynder " + tour[i].openingDate + "</p></div>";
        if (tour[i].prizes.length > 0) {
            output += "<div class='tour-price-list'>";
            output += "<table><tr>";
            for (let j = 0; j < tour[i].prizes.length; j++) {
                output += "<td>";
                output += "<div class='tour-price'>";
                output += "<p>" + (j+1) + ". Plads</p>";
                output += "<img src='" + tour[i].prizes[j].p_image + "'>";
                output += "<p>" + tour[i].prizes[j].p_name + "</p>";
                output += "</div>";
                output += "</td>";
            }
            output += "</tr></table>";
            output += "</div>";
        }
        output += "</div>";
        $('#all_tours').append(output);
    }
}


// open modal for entering password
function openModal(source) {
    let tourID = $(source).closest("div").prop("id");
    $("#modal-join-sub").attr("id", tourID);
    $("#modal-join").modal('show');
}



function createTeam(source){
    console.log(source);
    let url = "/users/createtournamentteam";
    let tourID = $(source).prop("id");
    let t_name = $("#t_name").val();
    let t_pass = $("#t_pass").val();
    let t_pass2 = $("#t_pass2").val();
    let data = {t_name, t_pass, t_pass2, tourID};
    sendData(data, url);
}



// add user to tournament he selected
function joinTournamentTeam (source) {
    let url = "/users/jointournamentteam";

}

// leave group
function leaveTournament(source) {
    if (window.confirm("Vil du afmelde holdet fra turneringen?")) {
        let data = {"tourID": $(source).closest("div").prop("id")};
        let url = "/users/leavetournament";
        sendData(data, url);
    }
}


// send data to server
function sendData(data, url) {
    console.log(data,url);
    $.ajax({
        type: "PUT",
        url: url,
        dataType: 'json',
        data: data,
        success: function (response){
            if (typeof response.redirect === 'string'){
                window.location = response.redirect
            }
        }
    });
}

