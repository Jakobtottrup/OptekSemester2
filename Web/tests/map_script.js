/**
 * Created by chris on 31-03-2017.
 */
var map;
var mapCenter = {lat: 55.368674, lng: 10.428189};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: mapCenter,
        mapTypeId: 'terrain'
    });
}
