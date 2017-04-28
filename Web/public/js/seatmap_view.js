/**
 * Created by ste on 24-04-2017.
 */

var canvas = document.getElementById('pladskort-view');

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

function seatmapCleanup(json_seat) {
    if (json_seat == false || json_seat == []) {
        var thiswidth = 16;
        var thisheight = 8;

        temp = [];
        for (var i = 0; i < thiswidth * thisheight; i++) {
            temp.push({
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
    ctx.scale(scaling, scaling);

    seat_size = Math.min(mycanvas.width / seatmap.room_width, mycanvas.height / seatmap.room_height);
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

function updateInfoBox(index) {
    var seat = seatmap.seats[index];
    var infoText1 = "";
    var infoText2 = "";
    var infoText3 = "";

    if (seat.type == 2) {
        infoText1 = "Plads " + seat.label;
        if (seat.open == true) {
            infoText2 = "Status: Ledig";
        } else {
            infoText2 = seat.userid;
            if (seat.groupid) {
                infoText3 = seat.groupid;
            }
        }
    } else if (seat.type == 3) {
        infoText1 = "Administration";
        infoText2 = "Henvend dig her hvis du har problemer";
    } else if (seat.type == 4) {
        infoText1 = "Kiosk";
        infoText2 = "Åbent 10.00 - 22.00";
    }

    $(".pladskort-info").html("<p>" + infoText1 + "</p><p>" + infoText2 + "</p><p>" + infoText3 + "</p>");
}

/*** *********** ***/
/** draw on screen */
/*** *********** ***/

function drawScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < seatmap.seats.length; i++) {
        if (seatmap.seats[i].type != 0) {
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
canvas.addEventListener("mousemove", function(e){
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

    console.log(m_index);

    updateInfoBox(m_index);

    drawScreen();
});
