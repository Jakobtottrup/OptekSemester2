
function getEventData(){
    return $.ajax({
        type: 'GET',
        url: "/api/event",
        dataType: "json"
    }).done(function(data){
        EventData = data;
    });
}

$.when(getEventData()).done(function() {

// let target_date = new Date().getTime() + (1000*3600*48); // set the countdown date
    let target_date = new Date(EventData[0].eventTime).getTime(); // set the countdown date
    let days, hours, minutes, seconds; // variables for time units

    let countdown = document.getElementById("tiles"); // get tag element

    getCountdown();

    var timer = setInterval(function () { getCountdown(); }, 1000);

    function getCountdown(){

        // find the amount of "seconds" between now and target
        let current_date = new Date().getTime();
        let seconds_left = Math.floor((target_date - current_date) / 1000 - 7200); //timezone manually withdrawed

        if (seconds_left <= 0) {
            days = "00";
            hours = "00";
            minutes = "00";
            seconds = "00";
            clearInterval(timer);
        } else {
            days = pad( parseInt(seconds_left / 86400) );
            seconds_left = seconds_left % 86400;

            hours = pad( parseInt(seconds_left / (3600 + 7200) ) );
            seconds_left = seconds_left % 3600;

            minutes = pad( parseInt(seconds_left / 60) );
            seconds = pad( parseInt( seconds_left % 60 ) );
        }

        // format countdown string + set tag value
        countdown.innerHTML = "<span>" + days + "</span><span>" + hours + "</span><span>" + minutes + "</span><span>" + seconds + "</span>";
    }

    function pad(n) {
        return (n < 10 ? '0' : '') + n;
    }
});


