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
        url: "/api/user",
        dataType: "json"
    }).done(function(data){
        userData = data;7

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
    checkGroup(hasGroup, isLeader);
});


var Group = function(leaderID, members, groupName, _id){
    this.id = _id;
    this.groupName = groupName;
    this.leaderID = leaderID;
    this.members = members;
};




function checkGroup(hasGroup, isLeader){
    console.log("user is in group: "+hasGroup+" || user is leader: "+isLeader);
    if(hasGroup){
        $.each(groupData, function(key, groupData) {
            for(i=0;i<groupData.members.length;i++){
            new Group(groupData.leaderID, group.members, groupData.groupName, groupData._id);
            }
        });
    }
}