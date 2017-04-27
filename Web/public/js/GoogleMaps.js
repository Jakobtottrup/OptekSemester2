// /**
//  * Created on 2017-04-21.
//  */


// map center
var center = new google.maps.LatLng(55.369, 10.4282);

// marker position
var SDU = new google.maps.LatLng(55.3685, 10.4282);

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer(( { suppressMarkers: true } ));
    var mapOptions = {
        center: center,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true

    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsDisplay.setMap(map);

    // InfoWindow content
    var content = '<div id="iw-container">' +
        '<div class="iw-title">S7Lan, SDU Odense</div>' +
        '<div class="iw-content">' +
        '<img src="img/icons/Logo.png" alt="SDU Odense" height="75" width="75">' +
        '<div class="iw-subTitle">Kontakt</div>' +
        '<p>Syddansk Univervitet, Odense<br> Campusvej 55, <br> 5230 Odense M<br> ' +
        '<a href="https://s7lan.dk/"target="_blank">www.s7Lan.dk</a> <br>' +
        '</div>' +
        '</div>';

    // A new Info Window is created and set content
    var infowindowSDU = new google.maps.InfoWindow({
        content: content,

        // Assign a maximum value for the width of the infowindow allows
        // greater control over the various content elements
        maxWidth: 320
    });

    // marker options
    var marker = new google.maps.Marker({
        position: SDU,
        map: map,
        icon:"/img/icons/S7LanMarker.png",
        title:"Syddansk Universitet, Odense"
    });

    // This event expects a click on a marker
    // When this event is fired the Info Window is opened.
    google.maps.event.addListener(marker, 'click', function() {
        infowindowSDU.open(map, marker);
    });

    // Event that closes the Info Window with a click on the map
    google.maps.event.addListener(map, 'click', function() {
        infowindowSDU.close();
    });

    // Disables "Find Vej" button when pressed once
    $(document).on("click", "#getRoute", function() {
        $(this).prop("disabled", true);
    });
}

function showRoute() {


    navigator.geolocation.getCurrentPosition(function(pos) {
        var start = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

        var request = {
            origin:start,
            destination:SDU,
            travelMode: google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function(response, status) {
            if (status = google.maps.DirectionsStatus.OK) {
                var route = response.routes[0];
                var start =route.legs[0].start_location;
                var end =route.legs[0].end_location;
                addMarker(start);
                directionsDisplay.setDirections(response);
            } else alert("Directions request failed: "+status);
        });
    }, function(err) {
        alert('ERROR(' + err.code + '): ' + err.message);
    });
}

function addMarker(pos){
    new google.maps.Marker({
            position: pos,
            map: map,
            icon: 'img/icons/UserLocation.png',
            title: "Din Lokation"
        }
    )
}
google.maps.event.addDomListener(window, 'load', initialize);