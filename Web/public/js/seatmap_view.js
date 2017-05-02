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
    seatmapCleanup(seatmap);
    checkforDeletedUsers();
    setVariables();
    initMousemove();
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

function checkforDeletedUsers() {
    //infoFromID(id)
    seatmap.seats.forEach(function (item, index) {
        if (item.userid != 0) {
            if (!infoFromID(item.userid) || seatmap.seats[index].type != 2) {
                //delete user if userinfo can't be found or userid is not on a seat
                seatmap.seats[index].userid = 0;
            }
        }
    });
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





/**** ********* ****/
/*** Mouse Hover ***/
/**** ********* ****/

function initMousemove() {
    m_index = 0;
//test for mouse over
    canvas.addEventListener('mousemove', function(e) {
        convertMouse(e);
        updateInfoBox(m_index);
        drawScreen();
    }, false);
}
