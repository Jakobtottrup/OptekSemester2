/**
 * Created by chris on 31-03-2017.
 * Script for showing indoor location and getting directions for user at SDU Odense.
 * link to MapsIndoors documentation https://www.mapspeople.com/developers/web
 */


var GoogleMap, MapsIndoors;
var sdu_location = {lat: 55.3685, lng: 10.4282};
var test_location = {lat: 57.085809, lng: 9.9573899};


var init = function () {
    //setting Google Maps
    GoogleMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: sdu_location,
        mapTypeId: 'terrain'
    });

    //setting MapsIndoors
    MapsIndoors= new mapsindoors.MapsIndoors({
        map: GoogleMap
    });

    var div = document.createElement('div');
    var floorSelector = new mapsindoors.FloorSelector(div, MapsIndoors);
    GoogleMap.controls[google.maps.ControlPosition.RIGHT_TOP].push(div);

    mapsIndoors.displayRules.set("info", {
        from:16,
        icon:"http://myiconhost.com/info.png"
    });
};

google.maps.event.addDomListener(window, 'load', init);



//get directions
function showRoute() {
    var start = document.getElementById('start').value; //skal ændres til brugerens nuværende lokation
    var end = sdu_location;

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
}