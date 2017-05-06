/**
* Created by chris on 08-04-2017.
*/

// draw group list
$.when(getGroupData(), getUsersData(), getUserData()).done(function(){
    console.log("hasGroup: "+hasGroup());
    console.log("isLeader: "+isLeader());
    if (hasGroup() === false && isLeader() === false) {
        console.log("new user entered site");
        $("#create_btn").prepend('<button type="button" class="btn btn-lg btn-primary" id="create_group" data-toggle="modal" data-target="#modal-create" style="margin-top:5px;margin-bottom: 10px; float:right;">Opret gruppe</button>');
    } else {
        $("#modal-create").remove();
    }

    if (typeof groupData !== "undefined") {
        var output = "";
        $.each(groupData, function (key, data) {
            output += "<tr class='data_row' id='" + data._id + "'>";
            output += "<td><h2>" + data.groupName + "</h2></td>";
            output += "<td>" + showMembers(data) + "</td>";
            output += "<td id='controls'>" + placeButtons(data) + "</td>";
            output += "</tr>";
        });
        output += "";
        $('#data_insert').append(output);
    } else {
        console.log("no groups to be rendered");
    }
});


// place control buttons
function placeButtons(data) {
    var output = "<td>";
    if (userData.isAdmin === true || isLeader() === true){
        if (userData.isAdmin === true && hasGroup() === false) {
            output += "<button class='btn btn-success' onclick='joinGroup(this)'>Deltag i gruppe</button>";
        } else if (isLeader() === false){
            output += "<button class='btn btn-danger' onclick='leaveGroup(this)'>Forlad gruppe</button>";
        }
        output += "<button class='btn btn-primary' onclick='editGroup(this)'>Redigér gruppe</button>";
        output += "<button class='btn btn-danger' onclick='deleteGroup(this)'>Slet gruppe</button>";

    } else if (hasGroup() === false) {
        output += "<button class='btn btn-success' onclick='joinGroup(this)'>Deltag i gruppe</button>";

    } else if (hasGroup() === true){
        output += "<button class='btn btn-danger' onclick='leaveGroup(this)'>Forlad gruppe</button>";
    }
    output += "</td>";
    return output;
}


// list members of each group
function showMembers(data) {
    var output = "<b><b>"+findUserName(data.leaderID)+"</b></b>";
    for (i=0; i<data.members.length; i++){
        output += "<br>"+findUserName(data.members[i]);
    }
    return output;
}


// check if user is in group already
function hasGroup() {
    var hasGroup = false;
    $.each(groupData, function(key, groupData) {
        for (i = 0; i < groupData.members.length; i++) {
            if (userData._id === groupData.members[i]) {
                hasGroup = true;
            }
        }
    });
    return hasGroup;
}


// check if user is leader of current group
function isLeader() {
    var isLeader = false;
    $.each(groupData, function(key, groupData) {
        if (userData._id === groupData.leaderID){
            isLeader = true;
        }
    });
    return isLeader;
}


// add user to group he selected
function joinGroup (source) {
    var groupID = $(source).closest("tr").prop("id");
    console.log(groupID);
    var type = "PUT";
    var task = 0;
    sendData(groupID, type, task);
}


// leave group
function leaveGroup(source) {
    var groupID = $(source).closest("tr").prop("id");
    console.log(groupID);
    var type = "PUT";
    var task = 1;
    sendData(groupID, type, task);
}


// delete group
function deleteGroup (source) {
    var groupID = $(source).closest("tr").prop("id");
    console.log(groupID);
    var type = "DELETE";
    var delGroup = confirm("Vil du slette din gruppe?");
    var task = 2;
    if (delGroup === true) {
        sendData(groupID, type, task);
    }
}


// edit group
function editGroup (source) {
    var groupID = $(source).closest("tr").prop("id");
    console.log(groupID);
}


function sendData(groupID, type, task) {
    $.ajax({
        type: type,
        url: "/users/seatgroups/" + groupID + "/" + task,
        dataType: 'json',
        success: location.reload()
    });
}


// open modal for entering password
function openModal(source) {
    $("#modal-join").modal('show');
}
