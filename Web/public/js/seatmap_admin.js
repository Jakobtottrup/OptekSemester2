/**
 * Created by ste on 24-04-2017.
 */

    var temp;






    var canvas = document.getElementById('pladskort-admin');

    //get a reference to the 2d drawing context / api
    var ctx = canvas.getContext('2d');

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

    if (canvas.width > 1000) {
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

    //since all text is given in pixels
    scaling = canvas.width / 640;

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

/*
    seatmap = {
        'info':{
            'seats':20,
            'open':true
        },
        'seats':[
            {
                'type':'chair',
                'label':'B4',
                'state':0,
                'userid':'1234',
                'groupid':'444454434'
            },{
                'type':'chair',
                'label':'B3',
                'state':2,
                'userid':'6ts4ss',
                'groupid':'g4g33c32'
            },{
                'type':'wall',
                'label':'0',
                'state':0,
                'userid':'0',
                'groupid':'0'
            },{
                'type':'air',
                'label':'0',
                'state':0,
                'userid':'0',
                'groupid':'0'
            }
        ]
    };
*/

/*** ********** ***/
/** set functions */
/*** ********** ***/

    //reload on resize
    $(window).resize(function(){location.reload();});

function seatmapCleanup(json_seat) {
    if (json_seat == false || json_seat == []) {
        var thiswidth = 16;
        var thisheight = 9;

        temp = [];
        for (var i = 0; i < thiswidth * thisheight; i++) {
            temp.push({
                type: 0,
                label: i,
                state: 0,
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

}



/*** *********** ***/
/** draw on screen */
/*** *********** ***/

function drawScreen() {
    if (screen_level == 0) {
        //phone
        ctx.fillStyle = "#bfbfbf";
        ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

        ctx.scale(scaling, scaling);

        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.textAlign="center";
        ctx.fillText("Dette er skrøbeligt data.",320,160);
        ctx.fillText("Brug en større enhed.",320,200);

        ctx.scale(1/scaling, 1/scaling);
    } else {
        ctx.fillText("Det virker!",320,200);
    }
}

/* scale and rescale
ctx.scale(scaling, scaling);
ctx.scale(1/scaling, 1/scaling);
*/
