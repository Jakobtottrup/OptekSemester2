/**
 * Created by chris on 10-05-2017.
 */
var folder = "/uploads/image/gallery/";
$.ajax({
    url : "api/gallery",
    success: function (data) {
        for(i=0; i < data.length; i++){
            $("#image_div").append( "<img id='"+data[i]+"' src='"+ folder + data[i] +"'>" );
        }
    }
});