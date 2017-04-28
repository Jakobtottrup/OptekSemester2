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
m_index = -1;

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

function getUserData(){
    return $.ajax({
        type: 'GET',
        url: "/api/users",
        dataType: "json"
    }).done(function(data){
        userIDs = data;
    });
}

$.when(getSeatData(), getUserData()).done(function() {
    console.log(userIDs);
    seatmapCleanup(seatmap);
    setVariables();
    drawScreen();
});

function seatmapCleanup(json_seat) {
    if (json_seat == false || json_seat == []) {
        //seatmap is not defined
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

function updateInfoBox(index) {
    var seat = seatmap.seats[index];
    var infoText1 = "";
    var infoText2 = "";
    var infoText3 = "";

    if (seat.type == 2) {
        infoText1 = "Plads: " + seat.label;
        if (seat.userid == 0) {
            infoText2 = "Status: Ledig";
        } else {
            var userinfo = infoFromID(seat.userid);
            infoText2 = "Navn: " + userinfo.username;
            //tjek pladsgruppe-array her for hver brugers gruppe
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

function infoFromID(id) {
    return (userIDs.filter(function(a){ return a._id == id })[0]);
}

/*** ******** ***/
/** draw object */
/*** ******** ***/

function drawPixel(x, y, seat, hover) {
    if (seat.type == 1) {
        drawWall(x, y);
    } else if (seat.type == 2) {
        drawSeat(x, y, seat.userid, hover);
    } else if (seat.type == 3) {
        drawAdmin(x, y);
    } else if (seat.type == 4) {
        drawShop(x, y);
    }
}

function drawSeat(x, y, id, hover) {
    var offset = 6; //%
    offset = (seat_size / 100) * offset;
    var newsize = seat_size - (2 * offset);
    var halfsize = newsize / 2;

    var _x = x * seat_size + offset; //x to left
    var _y = y * seat_size + offset; //y to top
    var x_ = (x+1) * seat_size - offset; //x to right
    var y_ = (y+1) * seat_size - offset; //y to bottom
    var rad = 7; //cornor radius

    /*
    1 2 3
    8   4
    7 6 5
     */

    var cor1 = {x: _x, y: _y};
    var cor2 = {x: _x + halfsize, y: _y};
    var cor3 = {x: x_, y: _y};
    var cor4 = {x: x_, y: _y + halfsize};
    var cor5 = {x: x_, y: y_};
    var cor6 = {x: _x + halfsize, y: y_};
    var cor7 = {x: _x, y: y_};
    var cor8 = {x: _x, y: _y + halfsize};

    ctx.beginPath();
    ctx.moveTo(cor2.x, cor2.y);
    ctx.arcTo(cor3.x, cor3.y, cor4.x, cor4.y, rad);
    ctx.arcTo(cor5.x, cor5.y, cor6.x, cor6.y, rad);
    ctx.arcTo(cor7.x, cor7.y, cor8.x, cor8.y, rad);
    ctx.arcTo(cor1.x, cor1.y, cor2.x, cor2.y, rad);
    ctx.lineTo(cor2.x, cor2.y);
    ctx.closePath();

    if (id == 0) {
        //if seat is free
        if (hover) {
            ctx.fillStyle = "green";
        } else {
            ctx.fillStyle = "darkgreen";
        }
    } else {
        //if seat is taken
        if (hover) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "darkred";
        }
    }

    ctx.strokeStyle = "white";

    ctx.fill();
    ctx.stroke();
}

function drawWall(x, y) {
    ctx.fillStyle = "black";
    ctx.fillRect(x * seat_size, y * seat_size, seat_size, seat_size);
}

function drawAdmin(x, y) {
    ctx.fillStyle = "darkred";
    ctx.fillRect(x * seat_size, y * seat_size, seat_size, seat_size);
}

function drawShop(x, y) {
    ctx.fillStyle = "darkblue";
    ctx.fillRect(x * seat_size, y * seat_size, seat_size, seat_size);
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
            var _x = i % seatmap.room_width;
            var _y = (i - _x) / seatmap.room_width;
            drawPixel(_x, _y, seatmap.seats[i], (m_index == i));
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

    m_index = mx + (my * seatmap.room_width);

    //console.log(m_index);

    updateInfoBox(m_index);

    drawScreen();
});
