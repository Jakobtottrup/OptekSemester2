/**
 * Created by gobbe on 2017-04-21.
 */


    // map center
var center = new google.maps.LatLng(55.369, 10.4282);

// marker position
var SDU = new google.maps.LatLng(55.3685, 10.4282);

function initialize() {
    var mapOptions = {
        center: center,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    // InfoWindow content
    var content = '<div id="iw-container">' +
        '<div class="iw-title">S7Lan, SDU Odense</div>' +
        '<div class="iw-content">' +
        // '<div class="iw-subTitle">Historie</div>' +
        '<img src="img/icons/Logo.png" alt="SDU Odense" height="75" width="75">' +
        // '<p>S7LAN opstod blandt en mindre gruppe dataloger af årgang 2007. I første omgang var det meningen, at det skulle have været et lille LAN kun for datalogerne på årgang 2007, men efterhånden som planlægningen skred fremad, og crew members kom til, fandt vi ud af at der var potentiale for at lave et langt større arrangement. I efteråret 2008 afholdte vi så vores første store LAN, med 40 deltagere og præmier som XBOX360, eksterne harddiske og iPods. I 2009 gentog vi succesen og det var om muligt endnu sjovere end i 2008.</p>' +
        '<div class="iw-subTitle">Kontakt</div>' +
        '<p>Syddansk Univervitet, Odense<br> Campusvej 55, 5230 Odense M<br> <a href="https://s7lan.dk/"target="_blank">www.s7Lan.dk</a> <br>' +
        '</div>' +
        '<div class="iw-bottom-gradient"></div>' +
        '</div>';

    // A new Info Window is created and set content
    var infowindow = new google.maps.InfoWindow({
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
        title: "Syddansk Universitet, Odense"
    });

    // This event expects a click on a marker
    // When this event is fired the Info Window is opened.
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });

    // Event that closes the Info Window with a click on the map
    google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
    });
}
google.maps.event.addDomListener(window, 'load', initialize);