/**
 * Created by ste on 25-04-2017.
 */


// countdown timer
var end = new Date('05/29/2017 12:00 pm'); // Change the date here

var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

function showRemaining(){
    var now = new Date();
    var distance = end - now;
    if (distance < 0) {
        clearInterval(timer);
        document.getElementById('countdown').innerHTML = "WOOOO!";

        return;
    }
    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);

    document.getElementById('countdown').innerHTML = days + ' Dage ';
    document.getElementById('countdown').innerHTML += hours + ' Timer ';
    document.getElementById('countdown').innerHTML += minutes + ' Minutter ';
    document.getElementById('countdown').innerHTML += seconds + ' Sekunder ';
}

timer = setInterval (showRemaining, 1000);
/* Countdown script ends here */
