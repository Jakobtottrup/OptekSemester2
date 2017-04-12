/**
 * Created by chris on 09-04-2017.
 */

// get information from database
function getData() {
    console.log('requesting "seatgroup" data from database');
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/heroku_fxdl0qct/collections/seatgroups?apiKey=2sC5adiZTeej0Ye2PQhW6sGavUshB5Uy"
    }).done(function (groupData) {
        console.log('received seatgroup data');
        drawCurrentGroups(groupData);
    });

    console.log('requesting "user" data from database');
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/heroku_fxdl0qct/collections/user?apiKey=2sC5adiZTeej0Ye2PQhW6sGavUshB5Uy"
    }).done(function (userData) {
        console.log("received user data");
    });
}