/**
 * Created by Christian Skjerning on 5/6/2017.
 */

// wait for data to arrive
// $.when(getUsersData()).done(function() {



function findUserName(id) {
    var user = $.grep(usersData, function (usersData) {
        user = usersData._id === id;
        return user;
    });
    if (typeof user[0] === "object"){
        return user[0].username;

    } else if (typeof user[0] !== "object") {
        return "Argument is not a proper ID";

    } else if (typeof user[0] === "undefined") {
        return "ID was not found within users";
    }
}

// used for translating boolean into plain text
function translateBoolean(statement){
    if (statement) {
        return "Ja"; // true
    } else {
        return "Nej"; // false
    }
}
