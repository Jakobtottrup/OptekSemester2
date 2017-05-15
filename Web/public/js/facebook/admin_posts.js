/**
 * Created by ste on 15-05-2017.
 */

$.when(getFacebookData()).done(function(){
    fb_createPosts();
});

/*** ************* ***/
/** basic functions **/
/*** ************* ***/

function convertToText(rawtext) {
    var max_string_length = 2000;
    var max_word_length = 20;
    var word_length = 0;
    var text = "";

    for (var i = 0; i < rawtext.length && i < max_string_length; i++) {
        text += rawtext.charAt(i);
        if (rawtext.charAt(i) != " ") {
            word_length++;
            if (word_length >= max_word_length) {
                text += " ";
                word_length = 0;
            }
        } else {
            word_length = 0;
        }
    }

    return text;
}

/*** *************** ***/
/** content functions **/
/*** *************** ***/

function fb_created_time(time) {
    return convertTimeWithYear(time);
}

function fb_user_pic(user) {
    return "<img src='http://graph.facebook.com/" + user.id + "/picture?type=square' title='" + user.name + "'>";
}

function fb_post_text(post) {
    var text = "";

    text += "<div class='fb_message_text_container'>";
    text += "<div class='fb_message_text'>";
    text += convertToText(post.message);
    text += "</div>";
    text += "</div>";

    return text;
}

function fb_checkbox(thisid) {
    return "<div><input class='form-control' type='checkbox' name='posts_id' id='" + thisid + "' checked></div>";
}

/*** ********** ***/
/** create posts **/
/*** ********** ***/

function fb_createPosts() {
    output = "";

    output += "<form method='post' action='/admins/posts'>";

    for (var i = 0; i < fbData.data.length; i++) {
        fb_thispost(fbData.data[i]);
    }

    output += "<input class='form-control' min='0' max='100' type='number' name='max_posts' placeholder='max antal'>";

    output += "<button class='btn btn-primary' type='submit' value='submit'>Gem indstillinger</button>";

    output += "</form>";

    $("#fb_post_list").append(output);
}

function fb_thispost(post) {
    output += "<table border='1'>";

    output += "<tr>";

    output += "<td class='fb_pic'>";
    output += fb_user_pic(post.from);
    output += "</td>";

    output += "<td class='fb_date hidden-xs'>";
    output += fb_created_time(post.created_time);
    output += "</td>";

    output += "<td class='fb_text'>";
    output += fb_post_text(post);
    output += "</td>";

    output += "<td class='fb_checkbox'>";
    output += fb_checkbox(post.id);
    output += "</td>";

    output += "</tr>";

    output += "</table>";

    output += "<br>";
}

/*** ************* ***/
/** save checkboxes **/
/*** ************* ***/

function saveCheckboxes() {
    console.log("yo");
    var checkListID = [];
    $('input[type=checkbox]').each(function () {
        if (this.checked) {
            checkListID.push($(this).attr("id"));
        }
    });
    console.log(checkListID);

    var obj_list = {"posts_id": checkListID};

    $.ajax({
        type: 'POST',
        url: '/admins/posts',
        dataType: 'json',
        data: JSON.stringify(obj_list)
    });
}
