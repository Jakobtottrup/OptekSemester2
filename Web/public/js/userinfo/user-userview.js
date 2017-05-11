/**
 * Created by chris on 11-05-2017.
 */

$.when(getGroupData(), getUsersData()).done(function() {
    console.log(groupData);
    let output = "";
    for (let i = 0; i < usersData.length; i++){
        output += "<tr>";
        output += "<td>"+i+"</td>";
        output += "<td>"+usersData[i].username+"</td>";
        output += "<td>"+usersData[i].fakultet+"</td>";
        output += "<td>"+usersData[i].bnet+"</td>";
        output += "<td>"+usersData[i].steam+"</td>";
        output += "<td>"+seatGroup(usersData[i]._id)+"</td>";
        output += "<td>"+userSeat(usersData[i]._id)+"</td>";
        output += "<tr>";
    }
    output += "";
    $("#data_insert").append(output);
});



// check if user is in group already - returns boolean
function seatGroup(id) {
    console.log(id);
    for (let i = 0; i < groupData.length; i++) {
        for (let j = 0; j < groupData[i].members.length; i++){
            if (groupData[i].leaderID === id || groupData[i].members[j] === id) {
                console.log(groupData[i]);
                return groupData[i].groupName;
            } else {
                return "Bruger er ikke i gruppe"
            }
        }
    }
}


function userSeat(id) {

}

function searchTable() {
    // Declare variables
    let input, filter, table, tr, td, i;
    input = document.getElementById("input");
    filter = input.value.toUpperCase();
    table = document.getElementById("user_table");
    tr = table.getElementsByTagName("tr");

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