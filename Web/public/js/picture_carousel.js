/**
 * Created by ste on 16-05-2017.
 */

var folder = "/uploads/image/gallery/";
$.ajax({
    url : "/api/gallery",
    success: function (data) {
        $("#myPictureCarousel").append(caro_create_object(data));
    }
});

function caro_create_object(image) {
    var carousel = "";

    carousel += '<div id="myCarousel" class="carousel slide" data-ride="carousel">';;

    carousel += caro_start();

    carousel += '<div class="carousel-inner">';
    for (var i = 0; i < image.length; i++) {
        carousel += caro_addThis(image, i);
    }
    carousel += '</div>';

    carousel += caro_end();

    carousel += '</div>';

    return carousel;
}

function caro_start() {
    var thistext = "";
/*
    thistext += '<ol class="carousel-indicators">';
    thistext += '<li data-target="#myCarousel" data-slide-to="0" class="active"></li>';
    thistext += '<li data-target="#myCarousel" data-slide-to="1"></li>';
    thistext += '<li data-target="#myCarousel" data-slide-to="2"></li>';
    thistext += '</ol>';
*/
    return thistext;
}

function caro_addThis(thisimage, index) {
    var thistext = "";

    thistext += '<div class="item';
    if (index == 0) {
        thistext += ' active';
    }
    thistext += '">';

    thistext += "<img class='img-rounded' id='" + thisimage[index] + "' src='" + folder + thisimage[index] + "' style='100%'>";

    thistext += '</div>';

    return thistext;


    //return "<img class='img-rounded' id='" + thisimage[index] + "' src='" + folder + thisimage[index] + "' style='100%'>";

    if (index == 0) {
        return '<div class="item active"><img src="la.jpg" alt="Los Angeles" style="width:100%;"></div><div class="item"><img src="chicago.jpg" alt="Chicago" style="width:100%;"></div><div class="item"><img src="ny.jpg" alt="New york" style="width:100%;"></div>';
    } else {
        return "";
    }

}

function caro_end() {
    var thistext = "";

    thistext += '<a class="left carousel-control" href="#myCarousel" data-slide="prev">';
    thistext += '<span class="glyphicon glyphicon-chevron-left"></span>';
    thistext += '<span class="sr-only">Previous</span>';
    thistext += '</a>';
    thistext += '<a class="right carousel-control" href="#myCarousel" data-slide="next">';
    thistext += '<span class="glyphicon glyphicon-chevron-right"></span>';
    thistext += '<span class="sr-only">Next</span>';
    thistext += '</a>';

    return thistext;
}
