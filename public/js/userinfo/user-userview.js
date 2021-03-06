/**
 * Created by chris on 11-05-2017.
 */

$.when(getGroupData(), getUsersData()).done(function() {
    let output = "";
    for (let i = 0; i < usersData.length; i++){
        output += "<tr>";
        output += "<td class='hidden-xs hidden-sm hidden-md'>"+i+"</td>";
        output += "<td>"+usersData[i].username+"</td>";
        output += "<td class='hidden-xs hidden-sm hidden-md'>"+usersData[i].fakultet+"</td>";
        output += "<td>"+socialInfo(usersData[i])+"</td>";
        output += "<td>"+seatGroup(usersData[i]._id)+"</td>";
        output += "<td>"+userSeat(usersData[i]._id)+"</td>";
        output += "<tr>";
    }
    output += "";
    $("#data_insert").append(output);
});


// check if user is in group - returns group name
function seatGroup(id) {
    for (let i = 0; i < groupData.length; i++) {
        for (let j = 0; j < groupData[i].members.length; i++){
            if (groupData[i].leaderID === id) {
                console.log(findUserName(groupData[i].leaderID));
                return groupData[i].groupName + "<b> (Leder)</b>";
            } else if (groupData[i].members[j] === id) {
                console.log(findUserName(groupData[i].members[j]));
                return groupData[i].groupName;
            } else {
                return "Ingen gruppe";
            }
        }
    }
}


function userSeat(id) {
    return "Ikke færdiggjort";
}

function searchTable() {
    // Declare variables
    let input, filter, tr, td, i;
    filter = $("#input").val().toUpperCase();
    tr = $("#user_table").find("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}