/**
* Created by chris on 08-04-2017.
*/

var hasGroup = false, isLeader = false, ownGroup;
$.when(getGroupData(), getUsersData(), getUserData()).done(function(){
    // check if current user is in group already

    $.each(groupData, function(key, groupData) {
        for (i = 0; i < groupData.members.length; i++) {
            if (userData._id === groupData.members[i]) {
                hasGroup = true;
            }
        }
        if (userData._id === groupData.leaderID){
            hasGroup = true;
            isLeader = true;
            ownGroup = groupData;
        }
    });

    console.log("hasGroup: "+hasGroup +" | isLeader: "+isLeader);
    if (!hasGroup || !isLeader) {
        $("#create_btn").prepend('<button type="button" class="btn btn-lg btn-primary" id="create_group" data-toggle="modal" data-target="#modal-create" style="margin-top:5px;margin-bottom: 10px; float:right;">Opret gruppe</button>');
    } else if (hasGroup === false || isLeader === true) {
        drawOwnGroup(ownGroup);
    } else {
        $("#modal-create").remove();
    }
    drawGroups(hasGroup);
});


function drawOwnGroup (data) {
    var output = "<tr class='data_row' id='"+data._id+"'>";
    output += "<td>"+data.groupName+"</td>";
    output += "<td>"+showMembers(data)+"</td>";
    output += "<td><button class='btn btn-primary' style='margin-bottom:5px; width:100%'>Redigér gruppe</button><button onclick='deleteGroup(this)' class='btn btn-danger' style='width:100%'>Slet gruppe</button></td>";
    output += "</tr>";
    output += "";
    $('#data_insert').append(output);
}


function drawGroups (hasGroup) {
    var output = "";
    $.each(groupData, function(key, data){
        output += "<tr class='data_row' id='"+data._id+"'>";
        output += "<td>"+data.groupName+"</td>";
        output += "<td>"+showMembers(data)+"</td>";
        //output += "<td>"+showTournaments()+"</td>";
        if (!hasGroup){
            output += "<td><button class='btn btn-primary' onclick='joinGroup(this)'>Deltag i gruppe</button></td>";
        } else {
            output += "<td></td>";
        }
        output += "</tr>";
    });
    output += "";
    $('#data_insert').append(output);
    // $('#'+ownGroup._id).not(':first').remove();
}

function showMembers(data) {
    var output = "<b>"+findUserName(data.leaderID)+" (leder)</b>";
    for (i=0; i<data.members.length; i++){
        output += "<br>"+findUserName(data.members[i]);

        if (data.members[i] === userData._id) {
            output += "<td><button class='btn btn-primary' onclick='leaveGroup(this)'>Forlad gruppe</button></td>";
        }
    }
    return output;
}


function joinGroup (source) {
    var groupID = $(source).closest("tr").prop("id");
    var type = "PUT";
    var task = 0;
    sendData(groupID, type, task);
}

function leaveGroup(source) {
    var groupID = $(source).closest("tr").prop("id");
    var type = "PUT";
    var task = 1;
    sendData(groupID, type, task);
}

function deleteGroup (source) {
    var groupID = $(source).closest("tr").prop("id");
    var type = "DELETE";
    var delGroup = confirm("Vil du slette din gruppe?");
    var task = 2;
    if (delGroup === true) {
        sendData(groupID, type, task);
    }
}

function sendData(groupID, type, task) {
    $.ajax({
        type: type,
        url: "/users/seatgroups/" + groupID + "/" + task,
        dataType: 'json',
        success: location.reload()
    });
}

function openModal(source) {
    $("#modal-join").modal('show');
}
