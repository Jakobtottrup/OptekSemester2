/**
 * Created by Christian Skjerning on 5/6/2017.
 */


function resetEvent() {
    if (window.confirm("Vil du starte nyt event? - Alt bliver seriøst slettet \n >>>SLET IKKE UNDER UDVIKLING AF PROJEKT<<<")) {
        $.ajax({
            type: "PUT",
            url: "/admins/events/",
            dataType: 'json',
            success: function(data){
                if (typeof data.redirect === 'string'){
                    window.location = data.redirect;
                }
            }
        })
    }
}
