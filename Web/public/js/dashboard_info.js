/**
 * Created by chris on 26-04-2017.
 */

// ============== SHOWING TOURNAMENTS ============== //
// retrieve data from database
function getUserData(){
    return $.ajax({
        type: 'GET',
        url: "/api/localuser",
        dataType: "json"
    }).done(function(data){
        userData = data;
    });
}

$.when(document, getUserData()).done(function(){
    $("#username").append(userData.username);
    $("#email").append(userData.email);
    $("#age").append(userData.age);
    $("#studie").append(userData.studie);
    $("#fakultet").append(userData.fakultet);
    $("#steam").append(userData.steam);
    $("#bnet").append(userData.bnet);
});
