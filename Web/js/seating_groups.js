/**
 * Created by chris on 08-04-2017.
 */

//"create group" div
var newGroup = '<div class="groupContainer">' +
    '<div id="createDiv">' +
    '<p>Opret siddegruppe</p>' +
    '<svg fill="#8F8F8F" height="96" viewBox="0 0 24 24" width="96" xmlns="http://www.w3.org/2000/svg" onclick="createGroup()">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';


var groupCreated = '<div class="groupContainer">' +
    '<div id="groupDiv">' +
    '<p>Gruppe 1</p>' +
    '<svg fill="#8F8F8F" height="96" viewBox="0 0 24 24" width="96" xmlns="http://www.w3.org/2000/svg" onclick="changeGroupSettings">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM9.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8zm6.5 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';


var currentMember = '<div class="groupContainer">' +
    '<div id="userDiv">' +
    '<p>Bruger 1</p>' +
    '<svg fill="#8F8F8F" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg" onclick="viewUser()">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';

var newMember = '<div class="groupContainer">' +
    '<div id="userDiv">' +
    '<p>Deltag i gruppe</p>' +
    '<svg fill="#8F8F8F" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg" onclick="joinGroup()">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';


var noGroup = true; //skal erstattes med variabel fra database

function addGroupOption() {
    if (noGroup) {
        console.log("addGroupOption()");
        noGroup = false;
        $("#displayGroups").prepend(newGroup);

    }
}

function createGroup(){
    if(document.getElementById("createDiv")) {
        console.log("createGroup()");
        $( "div" ).remove("#createDiv");
        $("#displayGroups").prepend(groupCreated);
        $("#displayGroups").append(currentMember);
        $("#displayGroups").append(newMember);
    }
}


function joinGroup() {
    console.log("joinGroup()");
    $( "div" ).remove("#addMember");
    // $("#displayGroups").append(currentMember);
    $("#displayGroups").append(newMember);

}

function viewUser(){
    console.log("viewUser()");


}

function changeGroupSettings(){
    console.log("changeGroupSettings");


}