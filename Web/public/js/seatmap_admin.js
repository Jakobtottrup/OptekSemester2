/**
 * Created by ste on 24-04-2017.
 */


var canvas = document.getElementById('pladskort-admin');

//get a reference to the 2d drawing context / api
var ctx = canvas.getContext('2d');


/*** ****** ***/
/** settings **/
/*** ****** ***/

var temp;

mycanvas = {width: 640, height: 320};

col_state = ["green", "yellow", "red"];
col_state_m = ["darkgreen", "gold", "brown"];

/*** ********************** ***/
/** scale for responsive page */
/*** ********************** ***/

canvas.style.width = '100%';
canvas.style.height = canvas.style.width / (mycanvas.width / mycanvas.height);

// ...then set the internal size to match
canvas.width  = canvas.offsetWidth;
canvas.height = canvas.width / (mycanvas.width / mycanvas.height);

//set the drawing surface dimensions to match the canvas
canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

if (canvas.width > 800) {
    screen_level = 2; //big screen
} else if (canvas.width > 500) {
    screen_level = 1; //tablet
} else {
    screen_level = 0; //phone
}

$(".screen_level").html("<p>Screen level: " + screen_level + "</p>");

if (screen_level == 0) {
    $("#new_map").hide();
    $("#new_map_btn").hide();
} else {
    $("#new_map").show();
    $("#new_map_btn").show();
}

scaling = canvas.width / mycanvas.width;

//reload on resize
$(window).resize(function(){location.reload();});

/*** ***************** ***/
/** get map from databse */
/*** ***************** ***/

seatmap = false;

function getSeatData(){
    return $.ajax({
        type: 'GET',
        url: "/api/seats",
        dataType: "json"
    }).done(function(data){
        seatmap = data;
    });
}

$.when(getSeatData()).done(function() {
    seatmapCleanup(seatmap);
    setVariables();
    drawScreen();

    initMousemove();
});


//konverter kort til JSON
function savemap() {
    $(function () {
        $('#seatName').val(JSON.stringify(seatmap));
    });
}

function seatmapCleanup(json_seat) {
    if (json_seat == false || json_seat == []) {
        var thiswidth = 16;
        var thisheight = 8;

        mapDel(thiswidth, thisheight);

    } else {
        temp = JSON.stringify(json_seat).split("\\");
        var res = "";
        temp.forEach(function (item, index) {
            res += item;
        });

        var del_this = "container";
        temp = res.substring(res.indexOf(del_this) + del_this.length + 3, res.length - 3);
        seatmap = JSON.parse(temp);
    }
}

/*** *********** ***/
/** set variables **/
/*** *********** ***/

function setVariables() {
    ctx.scale(scaling, scaling);

    seat_size = Math.min(mycanvas.width / seatmap.room_width, mycanvas.height / seatmap.room_height);

    m_pixel_type = -1;
}

/*** ********** ****/
/** set functions **/
/*** ********** ****/

function pen(col) {
    m_pixel_type = col;
}

function mapDel(w, h) {
    temp = [];
    for (var i = 0; i < w * h; i++) {
        temp.push({
            type: 0,
            label: "A" + i,
            userid: 0
        });
    }

    seatmap = {
        room_width: w,
        room_height: h,
        seats_tot: 0,
        map_open: false,
        seats: temp
    };

    m_index = 0;
    drawScreen();
}

/**** ********* ****/
/*** Mouse Hover ***/
/**** ********* ****/

function initMousemove() {
//test for mouse over
    canvas.addEventListener("click", function (e) {
        //get mouse coordinates according to canvas position on screen
        convertMouse(e);

        if (m_pixel_type >= 0) {
            seatmap.seats[m_index].type = m_pixel_type;
        }

        drawScreen();
    });

//test for mouse over
    canvas.addEventListener("mousemove", function (e) {
        //get mouse coordinates according to canvas position on screen
        convertMouse(e);

        drawScreen();
    });
}
