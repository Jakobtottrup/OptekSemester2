/**
 * Created by chris on 26-04-2017.
 */

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
    if (active === true && payment === true || userData.isAdmin) {
        $("#join_button").remove();
        $("#leave_button").remove();
    } else if (active === true){
        $("#join_button").remove();
        $("#event_info").remove();
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
            type: "POST",
            url: "/users/joinevent",
            dataType: 'json',
            success: function (data){
                if (typeof data.redirect === 'string'){
                    window.location = data.redirect
                }
            }
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

function sendData() {
    if (window.confirm("Vil du gemme de nye oplysninger?")) {
        let email = isEmail($('#input_email').val());
        let age = $('#input_age').val();
        let studie = $('#input_studie').val();
        let fakultet = $('#input_fakultet').val();
        let steam = $('#input_steam').val();
        let bnet = $('#input_bnet').val();

        if (email === true){
            $("#modal-edit").modal('hide');
            let email = $('#input_email').val();
            data = {email, age, studie, fakultet, bnet, steam};

            $.ajax({
                type: "PUT",
                url: "/users/userupdate"/* + username + "/" + email + "/" + age + "/" + studie + "/" + fakultet + "/" + steam + "/" + bnet*/,
                dataType: 'json',
                data: data,
                success: function (data){
                    if (typeof data.redirect === 'string'){
                        window.location = data.redirect
                    }
                }
            });
        } else {
            $('#input_email').css('color', 'red').val("VENLIGST INDTAST GYLDIG EMAIL");
            // $('#input_email').blur();
            // $('#input_email').focus($('#input_email').css('color', 'black'));
        }
    }
}

// make sure input has email format
function isEmail(email) {
    let regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}


function drawGroup() {


}


function drawTournament() {

}