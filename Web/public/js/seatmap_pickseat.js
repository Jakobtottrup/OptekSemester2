/**
 * Created by ste on 24-04-2017.
 */

var canvas = document.getElementById('pladskort-pick');

//get a reference to the 2d drawing context / api
var ctx = canvas.getContext('2d');


/*** ****** ***/
/** settings **/
/*** ****** ***/

var temp;
m_index = -1;

mycanvas = {width: 640, height: 320};

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

function getLocalUserData(){
    return $.ajax({
        type: 'GET',
        url: "/api/localuser",
        dataType: "json"
    }).done(function(data){
        localuser = data;
    });
}

function getSeatGroupData(){
    return $.ajax({
        type: 'GET',
        url: "/api/seatgroups",
        dataType: "json"
    }).done(function(data){
        seatgroups = data;
    });
}

$.when(getSeatData(), getUserData(), getLocalUserData(), getSeatGroupData()).done(function() {
    seatmapCleanup(seatmap);
    checkforDeletedUsers();
    rescaleCanvas();
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

function infoFromID(id) {
    return (userIDs.filter(function(a){ return a._id == id })[0]);
}

function checkSeatStatus() {
    hasSeat = false;
    seatmap.seats.forEach(function (item, index) {
        if (item.userid != 0) {
            if (item.userid == localuser._id) {
                hasSeat = true;
            }
        }
    });

    UserInGroup = false;
    isGroupLeader = false;

    seatgroups.forEach(function (item, index) {
        if (item.leaderID == localuser._id) {
            isGroupLeader = true;
        } else {
            item.members.forEach(function (mem_item, mem_index) {
                if (mem_item == localuser._id) {
                    UserInGroup = true;
                }
            });
        }
    });
}

function chooseSeat() {
    seatclick = seatmap.seats[m_index];
    if (seatclick.type == 2) {
        console.log("------------");
        console.log("Has seat: " + hasSeat);
        console.log("in Group: " + UserInGroup);
        console.log("Group leader: " + isGroupLeader);

        updateInfoBox("Denne plads er " + seatclick.label, "", "");

    } else {
        updateInfoBox("", "", "");
    }
}

// updateInfoBox("", "", "");
function updateInfoBox(text1, text2, text3) {
    $(".pladskort-info").html("<p>" + text1 + "</p><p>" + text2 + "</p><p>" + text3 + "</p>");
}

/**** ********* ****/
/*** Mouse Hover ***/
/**** ********* ****/

function initMousemove() {
    m_index = 0;
//test for mouse over
    canvas.addEventListener('mousemove', function(e) {
        convertMouse(e);
        drawScreen();
    }, false);

    canvas.addEventListener('click', function(e) {
        convertMouse(e);
        checkSeatStatus();
        chooseSeat();
        drawScreen();
    }, false);
}

