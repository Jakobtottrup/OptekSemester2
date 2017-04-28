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

        temp = [];
        for (var i = 0; i < thiswidth * thisheight; i++) {
            temp.push({
                type: 0,
                label: i,
                open: false,
                userid: 0,
                groupid: 0
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
    ctx.scale(scaling, scaling);

    seat_size = Math.min(mycanvas.width / seatmap.room_width, mycanvas.height / seatmap.room_height);

    m_pixel_type = -1;
}

/*** ********** ****/
/** set functions **/
/*** ********** ****/

function getSeatColor(seat) {
    //void
    if (seat.type == 0) {
        return "gray";
    }
    //wall
    if (seat.type == 1) {
        return "black";
    }
    //seat
    if (seat.type == 2) {
        return "green";
    }
    //admin area
    if (seat.type == 3) {
        return "darkred";
    }
    //kiosk
    if (seat.type == 4) {
        return "blue";
    }
    //error
    console.log(seat);
    return "purple";
}

/*** *********** ***/
/** draw on screen */
/*** *********** ***/

function drawScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < seatmap.seats.length; i++) {
            ctx.fillStyle = getSeatColor(seatmap.seats[i]);
            var _x = i % seatmap.room_width;
            var _y = (i - _x) / seatmap.room_width;
            ctx.fillRect(_x * seat_size, _y * seat_size, seat_size, seat_size);
        }
    }
}

/**** ********* ****/
/*** Mouse Hover ***/
/**** ********* ****/

//test for mouse over
canvas.addEventListener("click", function(e){
    //get mouse coordinates according to canvas position on screen
    var canvasBounds = canvas.getBoundingClientRect();
    var mouseX = Math.floor(e.pageX - canvasBounds.left + 1);
    var mouseY = Math.floor(e.pageY - canvasBounds.top + 1);

    var screenWidth = Math.floor(canvasBounds.right - canvasBounds.left + 1);
    var screenHeight = Math.floor(canvasBounds.bottom - canvasBounds.top + 1);

    var mx = Math.floor(seatmap.room_width / screenWidth * mouseX);
    if (mx >= seatmap.room_width) {
        mx = seatmap.room_width - 1;
    }
    if (mx < 0) {
        mx = 0;
    }

    var my = Math.floor(seatmap.room_height / screenHeight * mouseY);
    if (my >= seatmap.room_height) {
        my = seatmap.room_height - 1;
    }
    if (my < 0) {
        my = 0;
    }

    var m_index = mx + (my * seatmap.room_width);

    if (m_pixel_type >= 0) {
        seatmap.seats[m_index].type = m_pixel_type;
    }

    drawScreen();
});
