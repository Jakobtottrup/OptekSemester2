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

// add user to tournament he selected
function joinTournament (source) {
    let tourID = $(source).prop("id");
    let tn = $("#t_name").val();
    let tp = $("#t_pass").val();
    let tp2 = $("#t_pass2").val();
    console.log(tourID);
    let type = "PUT";
    let task = 0;
    sendData(tourID , type, task, tn, tp, tp2);
}

// leave group
function leaveTournament(source) {
    if (window.confirm("Vil du afmelde holdet fra turneringen?")) {
        let tourID = $(source).closest("div").prop("id");
        let tn = "something";
        let tp = "something";
        let type = "PUT";
        let task = 1;
        sendData(tourID, type, task, tn, tp, tp2);
    }
}

function sendData(tourID, type, task, tn, tp, tp2) {
    console.log(tourID, type, task, tn, tp, tp2);
    $.ajax({
        type: type,
        url: "/users/tournaments/" + tourID + "/" + task + "/" + tn + "/" + tp + "/" + tp2,
        dataType: 'json',
        success: location.reload()
    });
}

