/**
 * Created by chris on 08-04-2017.
 */

//"create group" div
var newGroup = '<div class="group-container">' +
    '<div id="create-div">' +
    '<p>Opret siddegruppe</p>' +
    '<svg height="96" viewBox="0 0 24 24" width="96" xmlns="http://www.w3.org/2000/svg" onclick="createGroup()" type="button">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';

//group created (circle with 3 inner circles)
var groupCreated = '<div class="group-container">' +
    '<div id="group-div">' +
    '<p>Gruppe 1</p>' +
    '<svg height="96" viewBox="0 0 24 24" width="96" xmlns="http://www.w3.org/2000/svg" onclick="changeGroupSettings" type="button">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';

//adds current user to selected group
var currentMember = '<div class="group-container">' +
    '<div id="user-div">' +
    '<p>Bruger 1</p>' +
    '<svg height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg" onclick="viewUser()" type="button">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';

//add another member to group
var newMember = '<div class="group-container">' +
    '<div id="user-div">' +
    '<p>Deltag i gruppe</p>' +
    '<svg height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg" onclick="joinGroup()" type="button">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';


var noGroup = true; //skal erstattes med variabel fra database, der fortæller om brugeren allerede er i en gruppe.

function addGroupOption() {
    if (noGroup) {
        console.log("addGroupOption()");
        noGroup = false;
        $("#display-groups").prepend(newGroup);
    }
}

function createGroup(){
    if(document.getElementById("create-div")) {
        console.log("createGroup()");
        $( "div" ).remove("#create-div");
        $("#display-groups").prepend(groupCreated);
        $("#display-groups").append(currentMember);
        $("#display-groups").append(newMember);
    }
}

function joinGroup() {
    console.log("joinGroup()");
    $( "div" ).remove("#addMember");
    $("#displayGroups").append(currentMember);
    $("#display-groups").append(newMember);

}

function viewUser(){
    console.log("viewUser()");

}

function changeGroupSettings(){
    console.log("changeGroupSettings");
}

/*
//write data to database
$(document).ready(function(){
    $('#add-group').on('submit', function(e){
        e.preventDefault();
        var group-title =$('#name').val();
        var password =$('#password').val();
        var group-creator = $('#').val();

        $.ajax({
            url: "https://api.mlab.com/api/1/databases/heroku_fxdl0qct/collections/books?apiKey=2sC5adiZTeej0Ye2PQhW6sGavUshB5Uy",
            data: JSON.stringify({
                "group-title": group-title,
                "password": password,
                "group-creatrr": group-creator
            }),
            type: "POST",
            contentType: "application/json",
            success: function(data){
                window.location.href="seating_groups.html";
            },
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    });
});




/*
//get information from database
function getGroups(){
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/heroku_fxdl0qct/collections/books?apiKey=2sC5adiZTeej0Ye2PQhW6sGavUshB5Uy"
    }).done(function(data){
        var output ='<div>';
        $.each(data, function(key, data){
            output += '<div class="well">';
            output += '<h3>'+data.title+'</h3>';
            output += '<p>category: '+data.category+'</p>';
            output += '<p>'+data.excerpt+'</p>';
            output += '</div>';
        });
        output += '</div>';
        $('#books').html(output);
    });
}
*/