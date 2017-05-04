/**
 * Created by ste on 24-04-2017.
 */


var canvas = document.getElementById('pladskort-admin');

//get a reference to the 2d drawing context / api
var ctx = canvas.getContext('2d');


/*** ****** ***/
/** settings **/
/*** ****** ***/

mapBorder = {height: {min: 4, max: 30}, width: {min: 10, max: 20}};
expandType = 0;

var temp;

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
// canvas.width = canvas.scrollWidth;
// canvas.height = canvas.scrollHeight;

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
    rescaleCanvas();
    initVariables();
    initMousemove();
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

function initVariables() {
    ctx.scale(scaling, scaling);

    setVariables();

    m_pixel_type = -1;
}

function setVariables() {
    seat_size = Math.min(mycanvas.width / seatmap.room_width, mycanvas.height / seatmap.room_height);
}

function rescaleCanvas() {
    mycanvas.width = 640;
    mycanvas.height = mycanvas.width / seatmap.room_width * seatmap.room_height;

    canvas.style.width = '100%';
    canvas.style.height = canvas.style.width / (mycanvas.width / mycanvas.height);

// ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.width / (mycanvas.width / mycanvas.height);

    scaling = canvas.width / mycanvas.width;
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

function buildFrame() {
    //top
    for (var i = 0; i < seatmap.room_width; i++) {
        seatmap.seats[i].type = 1;
    }

    //bottom
    for (var i = 0; i < seatmap.room_width; i++) {
        seatmap.seats[seatmap.room_width * (seatmap.room_height - 1) + i].type = 1;
    }

    //left
    for (var i = 0; i < seatmap.room_height; i++) {
        seatmap.seats[i * seatmap.room_width].type = 1;
    }

    //right
    for (var i = 0; i < seatmap.room_height; i++) {
        seatmap.seats[i * seatmap.room_width + seatmap.room_width - 1].type = 1;
    }

    drawScreen();
}

function expandFrame(dir, val) {
    /*
    dir
      1
    2   0
      3

    val
    0 = -
    1 = +

    */

    if (dir == 0) {
        expandFrameRight(val);
    } else if (dir == 1) {
        expandFrameUp(val);
    } else if (dir == 2) {
        expandFrameLeft(val);
    } else {
        expandFrameDown(val);
    }
}

function mapResize() {
    ctx.scale(1 / scaling, 1 / scaling);
    rescaleCanvas();
    ctx.scale(scaling, scaling);
}

function expandFrameUp(val) {
    if (val) {
        if (seatmap.room_height < mapBorder.height.max) {
            for (var i = 0; i < seatmap.room_width; i++) {
                seatmap.seats.splice(0, 0, {type: expandType, label: 0, userid: 0});
            }
            seatmap.room_height++;
            mapResize();
            drawScreen();
        }
    } else {
        if (seatmap.room_height > mapBorder.height.min) {
            seatmap.seats.splice(0, seatmap.room_width);
            seatmap.room_height--;
            mapResize();
            drawScreen();
        }
    }
}

function expandFrameDown(val) {
    if (val) {
        if (seatmap.room_height < mapBorder.height.max) {
            for (var i = 0; i < seatmap.room_width; i++) {
                seatmap.seats.push({type: expandType, label: 0, userid: 0});
            }
            seatmap.room_height++;
            mapResize();
            drawScreen();
        }
    } else {
        if (seatmap.room_height > mapBorder.height.min) {
            for (var i = 0; i < seatmap.room_width; i++) {
                seatmap.seats.pop();
            }
            seatmap.room_height--;
            mapResize();
            drawScreen();
        }
    }
}

function expandFrameRight(val) {
    if (val) {
        if (seatmap.room_width < mapBorder.width.max) {
            for (var i = seatmap.room_height; i > 0; i--) {
                seatmap.seats.splice((seatmap.room_width) * i, 0, {type: expandType, label: 0, userid: 0});
            }
            seatmap.room_width++;
            mapResize();
            setVariables();
            drawScreen();
        }
    } else {
        if (seatmap.room_width > mapBorder.width.min) {
            for (var i = seatmap.room_height; i > 0; i--) {
                seatmap.seats.splice((seatmap.room_width) * i - 1, 1);
            }
            seatmap.room_width--;
            mapResize();
            setVariables();
            drawScreen();
        }
    }
}

function expandFrameLeft(val) {
    console.log("left " + val);
    if (val) {
        if (seatmap.room_width < mapBorder.width.max) {
            for (var i = seatmap.room_height-1; i > -1; i--) {
                //seatmap.seats[i * seatmap.room_width].type = 2;
                seatmap.seats.splice(i * seatmap.room_width, 0, {type: expandType, label: 0, userid: 0});
            }
            seatmap.room_width++;
            mapResize();
            setVariables();
            drawScreen();
        }
    } else {
        if (seatmap.room_width > mapBorder.width.min) {
            for (var i = seatmap.room_height-1; i > -1; i--) {
                seatmap.seats.splice(i * seatmap.room_width, 1);
            }
            seatmap.room_width--;
            mapResize();
            setVariables();
            drawScreen();
        }
    }
}

function createLabels() {
    var i, j;
    var _x, _y;
    var dir;

    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    var curTabels = 0;

    //remove all labels
    for (i = 0; i < seatmap.seats.length; i++) {
        seatmap.seats[i].label = 0;
    }

    //count tabels
    for (i = 0; i < seatmap.seats.length; i++) {
        if (seatmap.seats[i].label == 0 && seatmap.seats[i].type == 2) {
            var testRight = 0;
            var testDown = 0;
            _x = i % seatmap.room_width;
            _y = (i - _x) / seatmap.room_width;

            j = _x;
            while (j < seatmap.room_width && seatmap.seats[_y * seatmap.room_width + j].type == 2) {
                j++;
                testRight++;
            }
            //console.log(testRight);
            j = _y;
            while (j < seatmap.room_height && seatmap.seats[j * seatmap.room_width + _x].type == 2) {
                j++;
                testDown++;
            }
            //console.log(testDown);
            if (testRight < testDown) {
                dir = 1; //label dir left
            } else {
                dir = 0; //label dir right

            }

            //label right
            if (dir == 0) {
                for (j = 0; j < testRight; j++) {
                    seatmap.seats[_y * seatmap.room_width + (_x + j)].label = 1;
                }
            } else {
                for (j = 0; j < testDown; j++) {
                    seatmap.seats[(_y + j) * seatmap.room_width + _x].label = 1;
                }
            }

            curTabels++;
        }
    }

    totTabels = curTabels;
    curTabels = 0;

    //remove all labels
    for (i = 0; i < seatmap.seats.length; i++) {
        seatmap.seats[i].label = 0;
    }

    //draw labels
    for (i = 0; i < seatmap.seats.length; i++) {
        if (seatmap.seats[i].label == 0 && seatmap.seats[i].type == 2) {
            var testRight = 0;
            var testDown = 0;
            _x = i % seatmap.room_width;
            _y = (i - _x) / seatmap.room_width;

            j = _x;
            while (j < seatmap.room_width && seatmap.seats[_y * seatmap.room_width + j].type == 2) {
                j++;
                testRight++;
            }
            //console.log(testRight);
            j = _y;
            while (j < seatmap.room_height && seatmap.seats[j * seatmap.room_width + _x].type == 2) {
                j++;
                testDown++;
            }
            //console.log(testDown);
            if (testRight < testDown) {
                dir = 1; //label dir left
            } else {
                dir = 0; //label dir right

            }

            var firLetter = curTabels % alphabet.length;
            var secLetter = (curTabels - firLetter) / alphabet.length;

            if (totTabels > alphabet.length) {
                thisLabel = alphabet.charAt(secLetter) + alphabet.charAt(firLetter);
            } else {
                thisLabel = alphabet.charAt(firLetter);
            }

            //label right
            if (dir == 0) {
                for (j = 0; j < testRight; j++) {
                    seatmap.seats[_y * seatmap.room_width + (_x + j)].label = "" + thisLabel + (j+1);
                }
            } else {
                for (j = 0; j < testDown; j++) {
                    seatmap.seats[(_y + j) * seatmap.room_width + _x].label = "" + thisLabel + (j+1);
                }
            }
            curTabels++;
        }
    }

    drawScreen();
}

/**** ********* ****/
/*** Mouse Hover ***/
/**** ********* ****/

function initMousemove() {
    m_index = 0;
    myMouseDown = false;
    drawType = 0;

//test for mouse over
    canvas.addEventListener("mousemove", function (e) {
        //get mouse coordinates according to canvas position on screen
        convertMouse(e);

        if (myMouseDown) {
            if (seatmap.seats[m_index].type != drawType) {
                seatmap.seats[m_index].type = drawType;
                createLabels();
            }
        }
        drawScreen();
    });

    canvas.addEventListener("mousedown", function (e) {
        //get mouse coordinates according to canvas position on screen
        myMouseDown = true;
        if (m_pixel_type >= 0) {
            if (seatmap.seats[m_index].type == m_pixel_type) {
                drawType = 0;
            } else {
                drawType = m_pixel_type;
            }
        } else {
            drawType = 0;
        }
        seatmap.seats[m_index].type = drawType;
        createLabels();
        drawScreen();
    });

    canvas.addEventListener("mouseup", function (e) {
        //get mouse coordinates according to canvas position on screen
        myMouseDown = false;
    });
}