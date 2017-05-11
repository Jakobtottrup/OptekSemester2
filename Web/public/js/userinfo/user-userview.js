/**
 * Created by chris on 11-05-2017.
 */

$.when(getGroupData(), getUsersData()).done(function() {
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
    for (let i = 0; i < groupData.length; i++) {
        console.log(groupData[i]);
        for (let j = 0; j < groupData[i].members.length; j++) {
            if (groupData[i].leaderID === id || groupData[i].members[j] === id) {
                console.log(groupData[i]);
                return groupData[i].groupName;
            } else {
                return "Bruger er ikke i gruppe"
            }
        }
    }
}
/*
function seatGroup(id) {
    console.log(id);
    for(i=0; i < groupData.length; i++){
        for(j=0; j < groupData[i].members.length; j++) {
            if (groupData[i].isLeader === id || groupData[i].members[j] === id) {
                return groupData[i].groupName;
            } else {
                return "Bruger er ikke i gruppe"
            }
        }
    }
}
*/


function userSeat(id) {

}