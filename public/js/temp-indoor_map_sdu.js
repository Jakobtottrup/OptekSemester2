/**
 * Created by chris on 31-03-2017.
 * Script for showing indoor location and getting directions for user at SDU Odense.
 * link to MapsIndoors documentation https://www.mapspeople.com/developers/web
 */


//var GoogleMap, MapsIndoors;
var sdu_location = {lat: 55.3685, lng: 10.4282}; //coordinates for SDU Odense
var test_location = {lat: 57.085809, lng: 9.9573899};


function initialize() {
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: sdu_location,
        zoom: 16

    });
    var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('<br/> Du er her <br/><br/>');
            map.setCenter(pos);
            map.setZoom(18);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}
//////////////////////////////////////////////////

/*
var init = function () {
    //setting Google Maps
    GoogleMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: sdu_location,
        mapTypeId: 'terrain'
    });

    //setting MapsIndoors
    MapsIndoors = new mapsindoors.MapsIndoors({
        map: GoogleMap
    });

    var div = document.createElement('div');
    var floorSelector = new mapsindoors.FloorSelector(div, MapsIndoors);
    GoogleMap.controls[google.maps.ControlPosition.RIGHT_TOP].push(div);

    mapsIndoors.displayRules.set("info", {
        from: 16,
        icon: "http://myiconhost.com/info.png"
    });

    document.getElementById("getRouteButton").addEventListener("click", showRoute());
}

//get directions
function showRoute() {
    console.log("clicked");
    // var start = google.loader.ClientLocation.address.city;
    // var end = sdu_location;
    //
    // var request = {
    //     origin: start,
    //     destination: end,
    //     travelMode: google.maps.TravelMode.DRIVING
    // };
}*/