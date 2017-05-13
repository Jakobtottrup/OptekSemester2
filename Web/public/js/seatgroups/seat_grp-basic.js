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
        let output = "";
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


/** available config options
 output += "<button class='btn btn-danger' onclick='leaveGroup(this)'>Forlad gruppe</button>";
 output += "<button class='btn btn-success' onclick='joinGroup(this)'>Deltag i gruppe</button>";
 output += "<button class='btn btn-primary' onclick='editGroup(this)'>Redigér gruppe</button>";
 output += "<button class='btn btn-danger' onclick='deleteGroup(this)'>Slet gruppe</button>";
 */

// place control buttons
function placeButtons(data) {
    let output = "<td>";

    // if user is admin
    if(userData.isAdmin === true){
        output += "<button class='btn btn-primary' onclick='editGroup(this)'>Redigér gruppe</button>";
        if (inGroup(data) === false) {
           // output += "<button class='btn btn-success' onclick='openModal(this)'>Deltag i gruppe</button>";
        } else if (inGroup(data) === true && isLeader(data) === false) {
            output += "<button class='btn btn-danger' onclick='leaveGroup(this)'>Forlad gruppe</button>";
        }
        output += "<button class='btn btn-danger' onclick='deleteGroup(this)'>Slet gruppe</button>";
    } else if (inGroup(groupData) === false){
        output += "<button class='btn btn-success join-group' onclick='openModal(this)'>Deltag i gruppe</button>";
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
    let output = "<b><b>"+findUserName(data.leaderID)+"</b></b>";
    for (i=0; i<data.members.length; i++){
        output += "<br>"+findUserName(data.members[i]);
    }
    return output;
}


// check if user is in group already - returns boolean
function inGroup(data) {
    let inGroup = false;
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
    let isLeader = false;
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
    let groupID = $(source).prop("id");
    let pass = $("#pass_field").val();
    let type = "PUT";
    let task = 0;
    console.log(groupID +" : "+ type +" : "+ task +" : "+ pass);

    sendData(groupID, type, task, pass);
}


// leave group
function leaveGroup(source) {
    let groupID = $(source).closest("tr").prop("id");
    let type = "PUT";
    let task = 1;
    let pass = "something";
    sendData(groupID, type, task, pass);
}


// delete group
function deleteGroup (source) {
    let groupID = $(source).closest("tr").prop("id");
    let type = "DELETE";
    let delGroup = confirm("Vil du slette gruppe?");
    let task = 2;
    let pass = "something";
    if (delGroup === true) {
        sendData(groupID, type, task, pass);
    }
}


// edit group
function editGroup (source) {

}


function sendData(groupID, type, task, pass){
    $.ajax({
        type: type,
        url: "/users/seatgroups/" + groupID + "/" + task + "/" + pass,
        dataType: 'json',
        success: location.reload()
    });
}

// open modal for entering password
function openModal(source) {
    let groupID = $(source).closest("tr").prop("id");
    $("#modal-join-sub").attr("id", groupID);
    $("#modal-join").modal('show');
}