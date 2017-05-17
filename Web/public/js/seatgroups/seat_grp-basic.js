/**
* Created by chris on 08-04-2017.
*/

// draw group list
$.when(getGroupData(), getUsersData(), getUserData()).done(function(){
    if (inGroup(groupData) === false && isLeader(groupData) === false || userData.isAdmin === true) {
        $("#create_btn").prepend('<button type="button" class="btn btn-lg btn-primary" id="create_group" data-toggle="modal" data-target="#modal-create" style="margin-top:5px;margin-bottom: 10px; float:right;">Opret siddegruppe</button>');
    } else {
        $("#modal-create").remove();
    }

    if (typeof groupData !== "undefined") {
        let output = "";
        $.each(groupData, function (key, data) {
            output += "<tr class='data_row' id='" + data._id + "'>";
            output += "<td><h3>" + data.group_name + "</h3></td>";
            output += "<td>" + showMembers(data) + "</td>";
            output += "<td class='hidden-xs' id='controls'>" + placeButtons(data) + "</td>";
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
    let output = "";
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
    output += "";
    return output;
}


// list members of each group
function showMembers(data) {
    let output = "<b><b>"+findUserName(data.leader_id)+"</b></b>";
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
            if (userData._id === data.leader_id) {
                isLeader = true;
            }
        });
    } else {
        if (userData._id === data.leader_id) {
            isLeader = true;
        }
    }
    return isLeader;
}


function sendData(type, url, data){
    console.log(type, url, data);
    $.ajax({
        type: type,
        url: url,
        dataType: 'JSON',
        data: data,
        success: function (data){
            if (typeof data.redirect === 'string'){
                window.location = data.redirect
            }
        }
    });
}

// create group
function createGroup () {
    let type = "PUT";
    let url = "/users/createseatgroup";

    let group_name = $("#name_field").val();
    let password = $("#pass_field").val();
    let password2 = $("#pass_field2").val();

    let data = {group_name, password, password2};
    sendData(type, url, data);
}

// delete group
function deleteGroup (source) {
    let type = "DELETE";
    let url = "/users/deleteseatgroup";

    let group_id = $(source).closest("tr").prop("id");
    let data = {group_id};
    if (confirm("Vil du slette gruppe?")) {
        sendData(type, url, data);
    }
}


// add user to group he selected
function joinGroup (source) {
    let type = "PUT";
    let url = "/users/joinseatgroups";

    let group_id = $(source).closest("tr").prop("id");
    let password = prompt("Indtast koden for gruppen");

    let data = {group_id, password};
    if (password) {
        sendData(type, url, data);
    }
}

// leave group
function leaveGroup(source) {
    let groupID = $(source).closest("tr").prop("id");
    let type = "PUT";
    let task = 1;
    let pass = "something";
    sendData(groupID, type, task, pass);
}



// edit group
function editGroup (source) {

}



// open modal for entering password
function openModal(source) {
    let groupID = $(source).closest("tr").prop("id");
    $("#modal-join-sub").attr("id", groupID);
    $("#modal-join").modal('show');
}



// filter groups
function sortGroups() {
    // Declare variables
    let input, filter, table, tr, td, i;
    input = document.getElementById("search-field");
    filter = input.value.toUpperCase();
    table = document.getElementById("seatgroup-table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
