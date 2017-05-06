/**
* Created by chris on 08-04-2017.
*/
// get information from database
function getGroupData(){
    return $.ajax({
        type: 'GET',
        url: "/api/seatgroups",
        dataType: "json"
    }).done(function(data){
        groupData = data;
    });
}

function getUsersData() {
    return $.ajax({
        type: 'GET',
        url: "/api/users",
        dataType: "json"
    }).done(function(data){
        usersData = data;
    });
}

function getUserData(){
    return $.ajax({
        type: 'GET',
        url: "/api/localuser",
        dataType: "json"
    }).done(function(data){
        userData = data;

    });
}

$.when(getGroupData(), getUsersData(), getUserData()).done(function(){
    // find current user in group
    var hasGroup = false, isLeader = false;
    $.each(groupData, function(key, groupData) {
        for (i = 0; i < groupData.members.length; i++) {
            if (userData._id === groupData.members[i]) {
                hasGroup = true;
            }
        }
        if (userData._id === groupData.leaderID){
            hasGroup = true;
            isLeader = true;
        }
    });
    if (!hasGroup || !isLeader) {
        var createGroupBtn = '<button type="button" class="btn btn-lg btn-primary" id="create_group" data-toggle="modal" data-target="#modal-create" style="margin-top:5px;margin-bottom: 10px; float:right;">Opret gruppe</button>';
        $("#create_btn").prepend(createGroupBtn);
    } else {
        $("#modal-create").remove();
    }
    drawGroups();
});


function drawGroups (hasGroup) {
    var output = "";
    $.each(groupData, function(key, data){
        output += "<tr class='data_row' id='"+data._id+"'>";
        output += "<td>"+data.groupName+"</td>";
        output += "<td>"+showMembers(data)+"</td>";
        //output += "<td>"+showTournaments()+"</td>";
        if (!hasGroup){
            output += "<td><button class='btn btn-primary' onclick='joinGroup(this)'>Deltag i gruppe</button></td>";
        }
        output += "</tr>";
    });
    output += "";
    $('#data_insert').append(output);
}

function showMembers(data) {
    var output = "<b>"+findUserName(data.leaderID)+" (leder)</b>";
    for (i=0; i<data.members.length; i++){
        output += "<br>"+findUserName(data.members[i]);
    }
    return output;
}


// function checkGroup(hasGroup, isLeader){
//     console.log("user is in group: "+hasGroup+" || user is leader: "+isLeader);
//     if(hasGroup){
//         $.each(groupData, function(key, groupData) {
//             for(i=0;i<groupData.members.length;i++){
//             new Group(groupData.leaderID, group.members, groupData.groupName, groupData._id);
//             }
//         });
//     }
// }



function joinGroup (source) {
    var groupID = $(source).closest("tr").prop("id");
    $.ajax({
        type: 'PUT',
        url: '/users/seatgroups/' + groupID,
        dataType: 'json',
        //success: location.reload()
    })
}
