
$(document).ready(function(){
    $('#add-book').on('submit', function(e){
        e.preventDefault();
        var title =$('#title').val();
        var category =$('#category').val();
        var excerpt = $('#excerpt').val();

        $.ajax({
            //url: "mongodb://localhost:27017/optek-test",  //christian local database test
            url: "https://api.mlab.com/api/1/databases/heroku_fxdl0qct/collections/books?apiKey=2sC5adiZTeej0Ye2PQhW6sGavUshB5Uy",
            data: JSON.stringify({
                "title": title,
                "category": category,
                "excerpt": excerpt
            }),
            type: "POST",
            contentType: "application/json",
            success: function(data){
                window.location.href="../content_pages/index.html";
            },
            error: function(xhr, status, err){
                console.log(err);
            }
        });
    });
});


function getBooks(){
    $.ajax({
        //url: "mongodb://localhost:27017/optek-test" //christian local database test
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