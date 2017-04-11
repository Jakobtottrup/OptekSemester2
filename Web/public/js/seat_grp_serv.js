/**
 * Created by chris on 09-04-2017.
 */

//write data to database
function writeGroups(data){
    e.preventDefault();
    var groupName =$('#group-name').val();
    var groupPassword =$('#group-password').val();
    //var leaderID = $().val(reg.user.id); //TODO: skal ændres ID'et på aktiv bruger (logget ind)
    //var eventID = $().val();

    $.ajax({
        url: "https://api.mlab.com/api/1/databases/heroku_fxdl0qct/collections/books?apiKey=2sC5adiZTeej0Ye2PQhW6sGavUshB5Uy",
        data: JSON.stringify({
            "name": groupName,
            "password": groupPassword,
            "leaderID": leaderID,
            "eventID": eventID
        }),
        type: "POST",
        contentType: "application/json",
        success: function(data){
            window.location.href="index.html";
        },
        error: function(xhr, status, err){
            console.log(err);
        }
    });
}

 //get information from database
function getData() {
    console.log('requesting "seatgroup" data from database');
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/heroku_fxdl0qct/collections/seatgroup?apiKey=2sC5adiZTeej0Ye2PQhW6sGavUshB5Uy"
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