/**
 * Created by ste on 02-05-2017.
 */

$.when(getTourData()).done(function() {
    if(tourData.length === 0) {
        $("#tour_head").text("Der er ingen turneringer åben på nuværende tidspunkt");
    } else {
        createTours()
    }
});

function createTours() {
    for (i = 0; i < tourData.length; i++) {
        let output = "";
        output += "<div class='tour-div'>";
        output += "<div class='tour-title'><h2>" + tourData[i].name + "</h2></div>";
        output += "<div class='tour-cover'><img src='" + tourData[i].coverImage + "'></div>";
        output += "<div class='tour-countdown'><p>Turneringen begynder d. " + convertTimeNoYear(tourData[i].openingDate) + "</p></div>";
        if (tourData[i].prizes.length > 0) {
            output += "<div class='tour-price-list'>";
            output += "<table><tr>";
            for (let j = 0; j < tourData[i].prizes.length; j++) {
                output += "<td>";
                output += "<div class='tour-price'>";
                output += "<p>" + (j+1) + ". Plads</p>";
                output += "<img src='" + tourData[i].prizes[j].p_image + "'>";
                output += "<p>" + tourData[i].prizes[j].p_name + "</p>";
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
