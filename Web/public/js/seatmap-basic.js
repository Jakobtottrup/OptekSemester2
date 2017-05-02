/**
 * Created by ste on 01-05-2017.
 */

m_index = 0;

color = {
    admin: {
        neutral: "darkred",
        stroke: "white",
        hover: "#aa0000"
    },
    shop: {
        neutral: "darkblue",
        stroke: "white",
        hover: "#0000bb"
    },
    seat: {
        free: {
            neutral: "darkgreen",
            stroke: "white",
            hover: "green"
        },
        taken: {
            neutral: "darkred",
            stroke: "white",
            hover: "red"
        },
        label: "yellow"
    },
    wall: "black"
};

/*** ********* ***/
/** draw object **/
/*** ********* ***/

function drawPixel(x, y, seat, hover, hoverType) {
    if (seat.type == 1) {
        drawWall(x, y);
    } else if (seat.type == 2) {
        drawSeat(x, y, seat.userid, hover, seat.label);
    } else if (seat.type > 2) {
        drawOther(x, y, seat.type, hoverType);
    }
}

function drawSeat(x, y, id, hover, label) {
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
            ctx.fillStyle = color.seat.free.hover;
        } else {
            ctx.fillStyle = color.seat.free.neutral;
        }
        ctx.strokeStyle = color.seat.free.stroke;
    } else {
        //if seat is taken
        if (hover) {
            ctx.fillStyle = color.seat.taken.hover;
        } else {
            ctx.fillStyle = color.seat.taken.neutral;
        }
        ctx.strokeStyle = color.seat.taken.stroke;
    }

    ctx.fill();
    ctx.stroke();

    //label
    ctx.textBaseline="middle";
    ctx.textAlign="center";
    ctx.fillStyle=color.seat.label;
    ctx.font = "7px Arial";
    ctx.fillText(label, x * seat_size + (seat_size / 2), y * seat_size + (seat_size / 2));
}

function drawWall(x, y) {
    ctx.fillStyle = color.wall;
    ctx.fillRect(x * seat_size, y * seat_size, seat_size, seat_size);
}

function drawOther(x, y, type, hoverType) {
    var offset = 6; //%
    offset = seat_size / 100 * offset;
    var newsize = seat_size - (2 * offset);
    var halfsize = newsize / 2;
    var index = y * seatmap.room_width + x;

    var check;

    var o_rad = 14;
    var i_rad = 3;
    //fix radius if set too big
    if (o_rad > newsize / 2) {o_rad = newsize / 2;}
    if (i_rad > offset) {i_rad = offset;}

    var x_center = x * seat_size + offset + halfsize;
    var y_center = y * seat_size + offset + halfsize;

    var p_top = y_center - halfsize;
    var p_bottom = y_center + halfsize;

    var p_left = x_center - halfsize;
    var p_right = x_center + halfsize;

    if (type == 3) {
        if (hoverType == 3) {
            ctx.fillStyle = color.admin.hover;
        } else {
            ctx.fillStyle = color.admin.neutral;
        }
        ctx.strokeStyle = color.admin.stroke;
    } else if (type == 4) {
        if (hoverType == 4) {
            ctx.fillStyle = color.shop.hover;
        } else {
            ctx.fillStyle = color.shop.neutral;
        }
        ctx.strokeStyle = color.shop.stroke;
    } else {
        ctx.fillStyle = "pink";
        ctx.strokeStyle = "yellow";
    }

    /*
     pixel position

     ptr pt ptl
     pr     pl
     pbr pb pbl
     */

    var ptr, pt, ptl, pr, pl, pbr, pb, pbl;
    ptr =  pt =  ptl =  pr =  pl =  pbr =  pb = pbl = false;

    //check left
    if (x > 0) {
        check = seatmap.seats[index-1].type;
        if (check == type || check == 1) {pl = true;}
    }

    //check right
    if (x < seatmap.room_width - 1) {
        check = seatmap.seats[index+1].type;
        if (check == type || check == 1) {pr = true;}
    }

    //check top
    if (y > 0) {
        check = seatmap.seats[index-seatmap.room_width].type;
        if (check == type || check == 1) {pt = true;}

        //check top left
        if (x > 0) {
            check = seatmap.seats[index-seatmap.room_width-1].type;
            if (check == type || check == 1) {ptl = true;}
        }

        //check top right
        if (x < seatmap.room_width - 1) {
            check = seatmap.seats[index-seatmap.room_width+1].type;
            if (check == type || check == 1) {ptr = true;}
        }
    }

    //check bottom
    if (y < seatmap.room_height - 1) {
        check = seatmap.seats[index+seatmap.room_width].type;
        if (check == type || check == 1) {pb = true;}

        //check bottom left
        if (x > 0) {
            check = seatmap.seats[index+seatmap.room_width-1].type;
            if (check == type || check == 1) {pbl = true;}
        }

        //check bottom right
        if (x < seatmap.room_width - 1) {
            check = seatmap.seats[index+seatmap.room_width+1].type;
            if (check == type || check == 1) {pbr = true;}
        }
    }

    /*
     corner type

     tl tr
     bl br
     */

    //get type of cornor for each cornor
    var tl, tr, bl, br;

    if (pt) {
        if (pl) {
            if (ptl) {tl = 0;} else {tl = 4;}
        } else {tl = 2;}
    } else {
        if (pl) {tl = 3;} else {tl = 1;}
    }

    if (pt) {
        if (pr) {
            if (ptr) {tr = 0;} else {tr = 4;}
        } else {tr = 2;}
    } else {
        if (pr) {tr = 3;} else {tr = 1;}
    }

    if (pb) {
        if (pl) {
            if (pbl) {bl = 0;} else {bl = 4;}
        } else {bl = 2;}
    } else {
        if (pl) {bl = 3;} else {bl = 1;}
    }

    if (pb) {
        if (pr) {
            if (pbr) {br = 0;} else {br = 4;}
        } else {br = 2;}
    } else {
        if (pr) {br = 3;} else {br = 1;}
    }



    //top left cornor
    if (tl == 1) {
        ctx.beginPath();
        ctx.moveTo(p_left, y_center);
        ctx.arcTo(p_left, p_top, x_center, p_top, o_rad);
        ctx.lineTo(x_center, p_top);
        ctx.lineTo(x_center, y_center);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(p_left, y_center);
        ctx.arcTo(p_left, p_top, x_center, p_top, o_rad);
        ctx.lineTo(x_center, p_top);
        ctx.stroke();
    } else if (tl == 2) {
        ctx.fillRect(p_left, p_top - offset, halfsize, halfsize + offset);
        ctx.beginPath();
        ctx.moveTo(p_left, p_top - offset);
        ctx.lineTo(p_left, y_center);
        ctx.stroke();
    } else if (tl == 3) {
        ctx.fillRect(p_left - offset, p_top, halfsize + offset, halfsize);
        ctx.beginPath();
        ctx.moveTo(p_left - offset, p_top);
        ctx.lineTo(x_center, p_top);
        ctx.stroke();
    } else if (tl == 4) {
        ctx.beginPath();
        ctx.moveTo(p_left - offset, y_center);
        ctx.lineTo(p_left - offset, p_top);
        ctx.arcTo(p_left, p_top, p_left, p_top - offset, i_rad);
        ctx.lineTo(p_left, p_top - offset);
        ctx.lineTo(x_center, p_top - offset);
        ctx.lineTo(x_center, y_center);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(p_left - offset, p_top);
        ctx.arcTo(p_left, p_top, p_left, p_top - offset, i_rad);
        ctx.lineTo(p_left, p_top - offset);
        ctx.stroke();
    } else {
        ctx.fillRect(p_left - offset, p_top - offset, halfsize + offset, halfsize + offset);
    }

    //draw top right cornor

    if (tr == 1) {
        ctx.beginPath();
        ctx.moveTo(x_center, p_top);
        ctx.arcTo(p_right, p_top, p_right, y_center, o_rad);
        ctx.lineTo(p_right, y_center);
        ctx.lineTo(x_center, y_center);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x_center, p_top);
        ctx.arcTo(p_right, p_top, p_right, y_center, o_rad);
        ctx.lineTo(p_right, y_center);
        ctx.stroke();
    } else if (tr == 2) {
        ctx.fillRect(x_center, p_top - offset, halfsize, halfsize + offset);
        ctx.beginPath();
        ctx.moveTo(p_right, y_center);
        ctx.lineTo(p_right, p_top - offset);
        ctx.stroke();
    } else if (tr == 3) {
        ctx.fillRect(x_center, p_top, halfsize + offset, halfsize);
        ctx.beginPath();
        ctx.moveTo(x_center, p_top);
        ctx.lineTo(p_right + offset, p_top);
        ctx.stroke();
    } else if (tr == 4) {
        ctx.beginPath();
        ctx.moveTo(x_center, p_top - offset);
        ctx.lineTo(p_right, p_top - offset);
        ctx.arcTo(p_right, p_top, p_right + offset, p_top, i_rad);
        ctx.lineTo(p_right + offset, p_top);
        ctx.lineTo(p_right + offset, y_center);
        ctx.lineTo(x_center, y_center);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(p_right, p_top - offset);
        ctx.arcTo(p_right, p_top, p_right + offset, p_top, i_rad);
        ctx.lineTo(p_right + offset, p_top);
        ctx.stroke();
    } else {
        ctx.fillRect(x_center, p_top - offset, halfsize + offset, halfsize + offset);
    }


    //draw bottom left cornor

    if (bl == 1) {
        ctx.beginPath();
        ctx.moveTo(p_left, y_center);
        ctx.arcTo(p_left, p_bottom, x_center, p_bottom, o_rad);
        ctx.lineTo(x_center, p_bottom);
        ctx.lineTo(x_center, y_center);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(p_left, y_center);
        ctx.arcTo(p_left, p_bottom, x_center, p_bottom, o_rad);
        ctx.lineTo(x_center, p_bottom);
        ctx.stroke();
    } else if (bl == 2) {
        ctx.fillRect(p_left, y_center, halfsize, halfsize + offset);
        ctx.beginPath();
        ctx.moveTo(p_left, y_center);
        ctx.lineTo(p_left, p_bottom + offset);
        ctx.stroke();
    } else if (bl == 3) {
        ctx.fillRect(p_left - offset, y_center, halfsize + offset, halfsize);
        ctx.beginPath();
        ctx.moveTo(p_left - offset, p_bottom);
        ctx.lineTo(x_center, p_bottom);
        ctx.stroke();
    } else if (bl == 4) {
        ctx.beginPath();
        ctx.moveTo(p_left - offset, y_center);
        ctx.lineTo(p_left - offset, p_bottom);
        ctx.arcTo(p_left, p_bottom, p_left, p_bottom + offset, i_rad);
        ctx.lineTo(p_left, p_bottom + offset);
        ctx.lineTo(x_center, p_bottom + offset);
        ctx.lineTo(x_center, y_center);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(p_left - offset, p_bottom);
        ctx.arcTo(p_left, p_bottom, p_left, p_bottom + offset, i_rad);
        ctx.lineTo(p_left, p_bottom + offset);
        ctx.stroke();
    } else {
        ctx.fillRect(p_left - offset, y_center, halfsize + offset, halfsize + offset);
    }


    //draw bottom right cornor

    if (br == 1) {
        ctx.beginPath();
        ctx.moveTo(x_center, p_bottom);
        ctx.arcTo(p_right, p_bottom, p_right, y_center, o_rad);
        ctx.lineTo(p_right, y_center);
        ctx.lineTo(x_center, y_center);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x_center, p_bottom);
        ctx.arcTo(p_right, p_bottom, p_right, y_center, o_rad);
        ctx.lineTo(p_right, y_center);
        ctx.stroke();
    } else if (br == 2) {
        ctx.fillRect(x_center, y_center, halfsize, halfsize + offset);
        ctx.beginPath();
        ctx.moveTo(p_right, y_center);
        ctx.lineTo(p_right, p_bottom + offset);
        ctx.stroke();
    } else if (br == 3) {
        ctx.fillRect(x_center, y_center, halfsize + offset, halfsize);
        ctx.beginPath();
        ctx.moveTo(x_center, p_bottom);
        ctx.lineTo(p_right + offset, p_bottom);
        ctx.stroke();
    } else if (br == 4) {
        ctx.beginPath();
        ctx.moveTo(x_center, p_bottom + offset);
        ctx.lineTo(p_right, p_bottom + offset);
        ctx.arcTo(p_right, p_bottom, p_right + offset, p_bottom, i_rad);
        ctx.lineTo(p_right + offset, p_bottom);
        ctx.lineTo(p_right + offset, y_center);
        ctx.lineTo(x_center, y_center);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(p_right, p_bottom + offset);
        ctx.arcTo(p_right, p_bottom, p_right + offset, p_bottom, i_rad);
        ctx.lineTo(p_right + offset, p_bottom);
        ctx.stroke();
    } else {
        ctx.fillRect(x_center, y_center, halfsize + offset, halfsize + offset);
    }
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
            drawPixel(_x, _y, seatmap.seats[i], (m_index == i), seatmap.seats[m_index].type);
        }
    }
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top
}

function convertMouse(e) {
    getMousePos(canvas, e);

    var canvasBounds = canvas.getBoundingClientRect();

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
}
