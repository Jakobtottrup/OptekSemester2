/**
 * Created by Jonas on 10-05-2017.
 */


var folder = "/uploads/image/gallery/";
$.ajax({
    url : "/api/gallery",
    success: function (data) {
        for(i=0; i < data.length; i++){
            $("#image_div").append( "<div id='"+data[i]+"'> <input type='button' value='Slet billedet' onclick='selectImage(this)'> <img class='img-rounded' id='"+data[i]+"' src='"+ folder + data[i] +"'>" + "</div>" );
        }
    }
});

function selectImage(data){
    window.confirm('Er du sikker på at du vil slette billedet');
    var selectedImage = $(data).closest("div").prop("id");

    console.log(selectedImage);
    $.ajax({
        url: "/admins/gallery/" + selectedImage,
        type: "DELETE",
        success: location.reload()
    })
}


// used to display filenames in input  - some default bootstrap
$(function() {
    // We can attach the `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function() {
        let input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    // We can watch for our custom `fileselect` event like this
    $(document).ready( function() {
        $(':file').on('fileselect', function(event, numFiles, label) {

            let input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' filer valgt' : label;

            if( input.length ) {
                input.val(log);
            } else {
                if( log ) alert(log);
            }
        });
    });
});
