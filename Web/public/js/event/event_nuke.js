/**
 * Created by Christian Skjerning on 5/6/2017.
 */



/*$("#nuke_event").on('click', */function resetEvent() {
    if (window.confirm("Vil du starte nyt event? - Alt bliver seriøst slettet")) {
        $.ajax({
            type: "PUT",
            url: "/admins/events/",
            dataType: 'json',
            success: location.reload()
        });
    }
}//);
