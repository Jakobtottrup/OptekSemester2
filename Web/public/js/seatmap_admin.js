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

mycanvas = {width: 640, height: 360};

col_state = ["green", "yellow", "red"];
col_state_m = ["darkgreen", "gold", "brown"];

/*** ********************** ***/
/** scale for responsive page */
/*** ********************** ***/

canvas.style.width = '100%';
canvas.style.height = (canvas.style.width / 16) * 9;

// ...then set the internal size to match
canvas.width  = canvas.offsetWidth;
canvas.height = (canvas.width / 16) * 9;

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

$("#screen_level").html("<p>Screen level: " + screen_level + "</p>");

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
        var thisheight = 9;

        temp = [];
        for (var i = 0; i < thiswidth * thisheight; i++) {
            temp.push({
                x: Math.floor(Math.random()*600),
                y: Math.floor(Math.random()*300),
                type: 0,
                label: i,
                state: Math.floor(Math.random()*3)
            });
        }

        seatmap = {
            room_width: thiswidth,
            room_height: thisheight,
            seats_tot: 0,
            map_open: false,
            seats: temp
        };

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
    temp = (mycanvas.width * 0.9) / seatmap.room_width;
    seat_size = temp * 0.9;
    seat_offset = (mycanvas.width - (seat_size * seatmap.room_width)) / (seatmap.room_width + 1);
}

/*** ********** ****/
/** set functions **/
/*** ********** ****/

function drawPixels() {
    var i = 0;
    for (var j = 0; j < seatmap.room_height; j++) {
        for (var k = 0; k < seatmap.room_width; k++) {
            ctx.fillStyle = col_state[seatmap.seats[i].state];
            ctx.fillRect(k * (seat_size + seat_offset) + seat_offset, j * (seat_size + seat_offset) + seat_offset, seat_size, seat_size);
            i++;
        }
    }
}

/*** *********** ***/
/** draw on screen */
/*** *********** ***/

function drawScreen() {
    ctx.scale(scaling, scaling);
    if (screen_level == 0) {
        //phone
        ctx.fillStyle = "#bfbfbf";
        ctx.fillRect(10, 10, mycanvas.width - 20, mycanvas.height - 20);

        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.textAlign="center";
        ctx.fillText("Dette er skrøbeligt data.",320,160);
        ctx.fillText("Benyt en anden enhed.",320,200);
    } else {
        drawPixels();
    }
}
