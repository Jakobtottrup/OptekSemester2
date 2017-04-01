/**
 * Created by chris on 31-03-2017.
 */
var map;
var sdu_location = {lat: 55.3685, lng: 10.4282};

function initMap() {
    //getting DOM element
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: sdu_location,
        mapTypeId: 'terrain'
    });
}



function showRoute() {
    var start = document.getElementById('start').value;
    var end = alexanderPlatzLatLng;

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
}