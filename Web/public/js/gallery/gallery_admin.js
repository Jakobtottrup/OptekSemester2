/**
 * Created by Jonas on 10-05-2017.
 */


var folder = "/uploads/image/gallery/";
$.ajax({
    url : "/api/gallery",
    success: function (data) {
        for(i=0; i < data.length; i++){
            $("#image_div").append( "<div id='"+data[i]+"'> <img id='"+data[i]+"' src='"+ folder + data[i] +"'>" + "<input type='button' value='Select' onclick='selectImage(this)'></div>" );
        }
    }
});

function selectImage(data){

    var selectedImage = $(data).closest("div").prop("id");

    console.log(selectedImage);
    $.ajax({
        url: "/admins/gallery/" + selectedImage,
        type: "DELETE",
        success: location.reload()
    })
}