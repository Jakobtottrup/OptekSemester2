/**
* Created by chris on 08-04-2017.
*/

// draw group list
$.when(getGroupData(), getUsersData(), getUserData()).done(function(){
     // console.log("inGroup checked: "+inGroup(groupData));
     // console.log("isLeader checked: "+isLeader(groupData));
    if (inGroup(groupData) === false && isLeader(groupData) === false || userData.isAdmin === true) {
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
    }
});


/* available config options
 output += "<button class='btn btn-danger' onclick='leaveGroup(this)'>Forlad gruppe</button>";
 output += "<button class='btn btn-success' onclick='joinGroup(this)'>Deltag i gruppe</button>";
 output += "<button class='btn btn-primary' onclick='editGroup(this)'>Redigér gruppe</button>";
 output += "<button class='btn btn-danger' onclick='deleteGroup(this)'>Slet gruppe</button>";
 */

// place control buttons
function placeButtons(data) {
    console.log(data.groupName);
    console.log("isLeader: "+ isLeader(data));
    console.log("inGroup: "+ inGroup(data));
    var output = "<td>";

    // if user is admin
    if(userData.isAdmin === true){
        output += "<button class='btn btn-primary' onclick='editGroup(this)'>Redigér gruppe</button>";
        if (inGroup(data) === false) {
            output += "<button class='btn btn-success' onclick='joinGroup(this)'>Deltag i gruppe</button>";
        } else if (inGroup(data) === true && isLeader(data) === false) {
            output += "<button class='btn btn-danger' onclick='leaveGroup(this)'>Forlad gruppe</button>";
        }
        output += "<button class='btn btn-danger' onclick='deleteGroup(this)'>Slet gruppe</button>";
    } else if (inGroup(groupData) === false){
        output += "<button class='btn btn-success join-group' onclick='joinGroup(this)'>Deltag i gruppe</button>";
    // if user is not admin
    } else {
        if (isLeader(data) === true) {
            output += "<button class='btn btn-primary' onclick='editGroup(this)'>Redigér gruppe</button>";
            output += "<button class='btn btn-danger' onclick='deleteGroup(this)'>Slet gruppe</button>";
        } else if (inGroup(data) === true && isLeader(data) === false) {
            output += "<button class='btn btn-danger' onclick='leaveGroup(this)'>Forlad gruppe</button>";
        }
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


// check if user is in group already - returns boolean
function inGroup(data) {
    var inGroup = false;
    if(typeof data.length === "number") {
        $.each(data, function (key, data) {
            for (i = 0; i < data.members.length; i++) {
                if (userData._id === data.members[i]) {
                    inGroup = true;
                }
            }
        });
    } else {
        for (i = 0; i < data.members.length; i++) {
            if (userData._id === data.members[i]) {
                inGroup = true;
            }
        }
    }
    if (inGroup === false) {
        inGroup = isLeader(data);
    }
    return inGroup;
}


// check if user is leader of current group - returns boolean
function isLeader(data) {
    var isLeader = false;
    if(typeof data.length === "number") {
        $.each(data, function (key, data) {
            if (userData._id === data.leaderID) {
                isLeader = true;
            }
        });
    } else {
        if (userData._id === data.leaderID) {
            isLeader = true;
        }
    }
    return isLeader;
}


// add user to group he selected
function joinGroup (source) {
    var groupID = $(source).closest("tr").prop("id");
    var type = "PUT";
    var task = 0;
    sendData(groupID, type, task);
}


// leave group
function leaveGroup(source) {
    var groupID = $(source).closest("tr").prop("id");
    var type = "PUT";
    var task = 1;
    sendData(groupID, type, task);
}


// delete group
function deleteGroup (source) {
    var groupID = $(source).closest("tr").prop("id");
    var type = "DELETE";
    var delGroup = confirm("Vil du slette gruppe?");
    var task = 2;
    if (delGroup === true) {
        sendData(groupID, type, task);
    }
}


// edit group
function editGroup (source) {
    openModal(source);
    var groupID = $(source).closest("tr").prop("id");
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
