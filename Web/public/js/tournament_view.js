/**
 * Created by ste on 02-05-2017.
 */

tour = false;

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
        var output = "";
        output += "<div class='tour-div'>";
        output += "<div class='tour-title'><h2>" + tour[i].name + "</h2></div>";
        output += "<div class='tour-cover'><img src='" + tour[i].coverImage + "'></div>";
        output += "<div class='tour-countdown'><p>Turneringen begynder " + tour[i].openingDate + "</p></div>";
        output += "<div class='tour-price-list'>";
        for (var j = 0; j < tour[i].prizes.length; j++) {
            output += "<div class='tour-price'>";
            output += "<p>" + (j+1) + ". Plads</p>";
            output += "<img src='" + tour[i].prizes[j].p_image + "'>";
            output += "<p>" + tour[i].prizes[j].p_name + "</p>";
            output += "</div>";
        }
        output += "</div>";
        output += "</div>";

        $('#all_tours').append(output);
    }
}
