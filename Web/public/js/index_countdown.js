
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

    //setInterval(function () { getCountdown(); }, 1000);





    /* this code is instead of setInterval */

    function interval(duration, fn){
        this.baseline = undefined

        this.run = function(){
            if(this.baseline === undefined){
                this.baseline = new Date().getTime();
            }
            fn()
            var end = new Date().getTime();
            this.baseline += duration;

            var nextTick = duration - (end - this.baseline);
            if(nextTick<0){
                nextTick = 0;
            }
            (function(i){
                i.timer = setTimeout(function(){
                    i.run(end);
                }, nextTick)
            }(this))
        }

        this.stop = function(){
            clearTimeout(this.timer);
        }
    }

    var timer = new interval(1000, function(){
        getCountdown();
        //console.log(new Date().getTime())
    });

    timer.run();

    /* this code is instead of setInterval */









    function getCountdown(){

        // find the amount of "seconds" between now and target
        let current_date = new Date().getTime();
        let seconds_left = (target_date - current_date) / 1000;

        days = pad( parseInt(seconds_left / 86400) );
        seconds_left = seconds_left % 86400;

        hours = pad( parseInt(seconds_left / (3600 + 7200) ) );
        seconds_left = seconds_left % 3600;

        minutes = pad( parseInt(seconds_left / 60) );
        seconds = pad( parseInt( seconds_left % 60 ) );

        // format countdown string + set tag value
        countdown.innerHTML = "<span>" + days + "</span><span>" + hours + "</span><span>" + minutes + "</span><span>" + seconds + "</span>";
    }

    function pad(n) {
        return (n < 10 ? '0' : '') + n;
    }
});


