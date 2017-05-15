/**
 * Created by chris on 26-04-2017.
 */

// ============== SHOWING TOURNAMENTS ============== //
// retrieve data from database
function getUserData(){
    return $.ajax({
        type: 'GET',
        url: "/api/localuser",
        dataType: "json"
    }).done(function(data){
        userData = data;
    });
}

$.when(document, getUserData()).done(function(){
    $("#username").append(userData.username);
    $("#email").append(userData.email);
    $("#age").append(userData.age);
    $("#studie").append(userData.studie);
    $("#fakultet").append(userData.fakultet);
    $("#payment_status").append(paymentStatus(userData.hasPaid, userData.isActive));
    $("#social").append(socialInfo(userData));
    $("#joined").append("<p>"+convertTimeWithYear(userData.joined)+"</p>");

});

function paymentStatus(payment, active) {
    if (active === true && payment === true) {
        $("#join_button").remove();
        $("#leave_button").remove();
    } else if (active === true){
        $("#join_button").remove();
    } else if (active === false && payment === false) {
        $("#event_info").remove();
        $("#leave_button").remove();
    } else if (payment === true){
        $("#join_button").remove();
        $("#leave_button").remove();
    }

    drawGroup();
    drawTournament();

    if(payment === true){
        return "<b>Godkendt</b>";
    } else if (payment === false) {
        return "<b>Ikke godkendt endnu</b>";
    }
}

function joinEvent() {
    if (window.confirm("Tryk OK for at bekræfte")) {
        $.ajax({
            type: "PUT",
            url: "/users/joinevent/",
            dataType: 'json',
            success: location.reload()
        });
    }
}

function toggleModal() {
    $("#modal-edit").modal('show');
    $('#input_username').val(userData.username);
    $('#input_email').val(userData.email);
    $('#input_age').val(userData.age);
    $('#input_studie').val(userData.studie);
    $('#input_fakultet').val(userData.fakultet);
    $('#input_steam').val(userData.steam);
    $('#input_bnet').val(userData.bnet);
}

function sendData_ui () {
    if (window.confirm("Vil du gemme de nye oplysninger?")) {
        $("#modal-edit").modal('hide');
        let username = $('#input_username').val();
        let email = $('#input_email').val();
        let age = $('#input_age').val();
        let studie = $('#input_studie').val();
        let fakultet = $('#input_fakultet').val();
        let steam = $('#input_steam').val();
        let bnet = $('#input_bnet').val();
        if (steam === ""){
            steam = "|"
        }
        if (bnet === ""){
            bnet = "|"
        }

        // console.log("username:",username,"\nage:",age,"\nemail:",email,"\nstudie:",studie,"\nfakultet:",fakultet,"\nsteam:",steam,"\nbnet:",bnet);
        $.ajax({
            type: "PUT",
            url: "/users/userupdate/" + username + "/" + email + "/" + age + "/" + studie + "/" + fakultet + "/" + steam + "/" + bnet,
            dataType: 'json',
            success: location.reload()
        });
    }
}

function drawGroup() {


}


function drawTournament() {

}