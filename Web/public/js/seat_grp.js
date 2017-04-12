/**
 * Created by chris on 08-04-2017.
 */

var newGroup;
newGroup = '<div class="group-container">' +
    '<div id="create-div">' +
    //'<p>Opret siddegruppe</p>' +
    '<svg height="96" viewBox="0 0 24 24" width="96" xmlns="http://www.w3.org/2000/svg" type="button" data-toggle="modal" data-target="#group-modal">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';

//group created (circle with 3 inner circles)
var groupCreated;
groupCreated = '<div class="group-container">' +
    '<div id="group-div">' +
    //'<p>Deltag i gruppep>' +
    '<svg height="96" viewBox="0 0 24 24" width="96" xmlns="http://www.w3.org/2000/svg" onclick="joinGroup" type="button">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';

//adds current user to selected group
var currentMember;
currentMember = '<div class="group-container">' +
    '<div id="user-div">' +
    '<p>Dig</p>' +
    '<svg height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg" onclick="viewUser()" type="button">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';

//add another member to group
var newMember;
newMember = '<div class="group-container">' +
    '<div id="user-div">' +
    '<p>Deltag i gruppe</p>' +
    '<svg height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg" onclick="joinGroup()" type="button">' +
    '<path d="M0 0h24v24H0z" fill="none"/>' +
    '<path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>' +
    '</svg>' +
    '</div>' +
    '</div>';



var noGroup = true;                                                                                                     //TODO: skal erstattes med variabel fra database, der fortæller om brugeren allerede er i en gruppe.
function createGroupOption(){
//    if (reg.user) {                                                                                                   //check whether user is logged in, in current session - using passport.js
            if (noGroup) {                                                                                              //check if user is already in group
                //console.log("create new group option added");
                noGroup = false;
                $("#create-group").prepend(newGroup);
            } else {
                $('#create-group').remove();
                $('#create-group-header').remove();
            }
 //   } else {window.alert("You must login before proceeding");}
}

function validateForms() {
    //$('#group-modal').validate();
    console.log('Forms are missing validation');
    removeCreateGroupOption();
}

function removeCreateGroupOption(){
    $('#create-group').remove();
    $('#create-group-header').remove();
}

function joinGroup(){
    $("#create-group").append(currentMember);
}

function drawCurrentGroups(groupData){
    var output = '<div class="groups">';
    $.each(groupData, function(key, groupData){
        output += '<h4>'+groupData.name+'</h4>';
        output += '<div class="group-wrapper" id="current-groups'+key+'"></div>';
        output += '</br>';
        //putMembersInGroup(key, groupData);
        $().append(newMember);
    });
    output += '</div>' + '</br>';
    $('#current-group-container').html(output);
}

function putMembersInGroup (key, groupData){
    for(i=0;i<groupData.members.length;i++) {
        $("#current-groups").append(currentMember);
    }
}

function viewUser(){console.log("viewUser()");} //TODO: brugerne skal kunne se hinanden profiler
function changeGroupSettings(){console.log("changeGroupSettings");} //TODO: brugeren skal kunne ændre gruppeoplysninger