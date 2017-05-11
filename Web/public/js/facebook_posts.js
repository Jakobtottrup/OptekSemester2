/**
 * Created by Christian Skjerning on 5/11/2017.
 */

function getFacebookData() {
    return $.ajax({
        type: 'GET',
        url: "/api/fb",
        dataType: "json"
    }).done(function(data){
        fbData = data;
    });
}


$.when(getFacebookData()).done(function(){
    console.log(fbData);

});