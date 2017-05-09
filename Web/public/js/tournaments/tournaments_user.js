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
    createTours();
});

function createTours() {
    for (i = 0; i < tour.length; i++) {
        let output = "";
        output += "<div class='tour-div' id='"+tour[i]._id+"'>";
        output += "<div class='tour-title'><h2>" + tour[i].name + "</h2></div>";
        output += "<div class='tour-cover'><img src='" + tour[i].coverImage + "'></div>";
        output += "<button class='btn btn-success' onclick='joinTournament(this)'>Tilmeld turnering</button>";
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



// add user to tournament he selected
function joinTournament (source) {
    let tourID = $(source).closest("div").prop("id");
    console.log(tourID);
    let type = "PUT";
    let task = 0;
    sendData(tourID , type, task);
}


// leave group
function leaveTournament(source) {
    let tourID = $(source).closest("div").prop("id");
    let type = "PUT";
    let task = 1;
    sendData(tourID, type, task);
}


function sendData(groupID, type, task) {
    $.ajax({
        type: type,
        url: "/users/tournaments/" + groupID + "/" + task,
        dataType: 'json',
        success: location.reload()
    });
}
