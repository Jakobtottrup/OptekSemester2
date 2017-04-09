/**
 * Created by chris on 09-04-2017.
 */

if (env === 'development') {
    mongoose.connect('mongodb://localhost/optektestdb');
    console.log("You're in development mode");
}   else {
    mongoose.connect('mongodb://optek:optek123@ds153400.mlab.com:53400/heroku_fxdl0qct');
    console.log("You're in production mode");
}


/*
//write data to database
$(document).ready(function(){
    $('#add-book').on('submit', function(e){
        e.preventDefault();
        var groupName =$('#group-name').val();
        var groupPassword =$('#group-password').val();
        var leaderID = $(null).val();                                                                                   //skal ændres ID'et på aktiv bruger (logget ind)

        $.ajax({
            url: "https://api.mlab.com/api/1/databases/heroku_fxdl0qct/collections/books?apiKey=2sC5adiZTeej0Ye2PQhW6sGavUshB5Uy",
            data: JSON.stringify({
                "groupName": groupName,
                "password": groupPassword,
                "leaderID": leaderID
            }),
            type: "POST",
            contentType: "application/json",
            success: function(data){
                window.location.href="index.html";
            },
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    });
});


 //get information from database
 function getGroups(){
 $.ajax({
 url: "https://api.mlab.com/api/1/databases/heroku_fxdl0qct/collections/books?apiKey=2sC5adiZTeej0Ye2PQhW6sGavUshB5Uy"
 }).done(function(data){
 var output ='<div>';
 $.each(data, function(key, data){
 output += '<div class="well">';
 output += '<h3>'+data.title+'</h3>';
 output += '<p>category: '+data.category+'</p>';
 output += '<p>'+data.excerpt+'</p>';
 output += '</div>';
 });
 output += '</div>';
 $('#books').html(output);
 });
 }
