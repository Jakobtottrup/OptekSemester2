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

var ownGroupID;
var hasGroup = false, isLeader = false;
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
            ownGroupID = groupData;
        }
    });
    if (!hasGroup || !isLeader) {
        var createGroupBtn = '<button type="button" class="btn btn-lg btn-primary" id="create_group" data-toggle="modal" data-target="#modal-create" style="margin-top:5px;margin-bottom: 10px; float:right;">Opret gruppe</button>';
        $("#create_btn").prepend(createGroupBtn);
    } else if (hasGroup === true) {
        drawOwnGroup(ownGroupID);
    } else {
        $("#modal-create").remove();
        // drawOwnGroup(isLeader);
    }
    drawGroups();
});


function drawGroups () {
    var output = "";
    $.each(groupData, function(key, data){
        output += "<tr class='data_row' id='"+data._id+"'>";
        output += "<td>"+data.groupName+"</td>";
        output += "<td>"+showMembers(data)+"</td>";
        //output += "<td>"+showTournaments()+"</td>";
        if (!hasGroup){
            output += "<td><button class='btn btn-primary'>Deltag i gruppe</button></td>";
        } else {
            output += "<td></td>";
        }
        output += "</tr>";
    });
    output += "";
    $('#data_insert').append(output);
    $('#'+ownGroupID._id).not(':first').remove();
}

function showMembers(data) {
    var output = "<b>"+findUserName(data.leaderID)+" (leder)</b>";
    for (i=0; i<data.members.length; i++){
        output += "<br>"+findUserName(data.members[i]);
    }
    return output;
}


function drawOwnGroup (data) {
    var output = "<tr class='data_row' id='"+data._id+"'>";
        output += "<td>"+data.groupName+"</td>";
        output += "<td>"+showMembers(data)+"</td>";
        output += "<td><button class='btn btn-primary' style='margin-bottom:5px; width:100%'>Redigér gruppe</button><button onclick='deleteGroup(this)' class='btn btn-danger' style='width:100%'>Slet gruppe</button></td>";
        output += "</tr>";
    output += "";
    $('#data_insert').append(output);
}


function deleteGroup (source) {
    var groupID = $(source).closest("tr").prop("id");
    var delGroup = confirm("Vil du slette denne gruppe?");
    if(delGroup === true) {
        $.ajax({
            type: 'DELETE',
            url: '/users/seatgroups/' + groupID,
            dataType: 'json',
            success: location.reload()
        });
    }
}



















































/*





function joinGroup (source) {
    $("#modal-join").modal('show');
    var groupID = $(source).closest("tr").prop("id");

    var formData = $("#join_form").serialize();
    PUTdata(formData)
}
function PUTdata(formData) {

    console.log($("#join_form").attr('action'));
    console.log(formData);

    $.ajax({
        type: 'PUT',
        url: $("#join_form").attr('action') + groupID,
        dataType: 'json',
        data: formData,
        success: location.reload()
    });
}

*/