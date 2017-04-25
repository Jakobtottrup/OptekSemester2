/**
 * Created by ste on 24-04-2017.
 */
document.write("seatmap admin script initialized");

function getSeatData(){
    return $.ajax({
        type: 'GET',
        url: "/api/seats",
        dataType: "json"
    }).done(function(data){
        groupData = data;
    });
}

$.when(getSeatData()).done(function(){
    console.log(groupData);
});

