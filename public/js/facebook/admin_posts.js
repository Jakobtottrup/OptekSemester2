/**
 * Created by ste on 15-05-2017.
 */

$.when(getFacebookAdminData(), getFacebookUserData()).done(function(){
    if (fb_userData !== null) {
        fb_createPosts();
    } else {
        fb_createErrorMessage();
    }
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
    return "<img src='https://graph.facebook.com/" + user.id + "/picture?type=square' title='" + user.name + "'>";
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

function fb_post_visible(curid) {
    var respond = false;
    for (var i = 0; i < fb_userData.data.length; i++) {
        if (fb_userData.data[i].id == curid) {
            respond = true;
        }
    }
    return respond;
}

function fb_checkbox(thisid) {
    var thistext = "<div><input class='form-control' type='checkbox' name='posts_id' id='" + thisid + "' ";

    if (fb_post_visible(thisid)) {
        thistext += "checked";
    } else {
        thistext += "not-checked";
    }
    thistext += "></div>";
    return thistext;
}

/*** ********** ***/
/** create posts **/
/*** ********** ***/

function fb_createPosts() {
    output = "";

    for (var i = 0; i < fb_adminData.data.length; i++) {
        fb_thispost(fb_adminData.data[i]);
    }

    output += "<button class='btn btn-primary' onclick='saveCheckboxes()'>Gem indstillinger</button>";

    $("#fb_post_list").append(output);
}

function fb_thispost(post) {
    output += "<div class='fb_admin_table'>";

    output += "<table border='0'>";

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

    output += "</div>";
}

/*** ************* ***/
/** save checkboxes **/
/*** ************* ***/

function saveCheckboxes() {
    let checkListID = [];
    $('input[type=checkbox]').each(function () {
        if (this.checked) {
            checkListID.push($(this).attr("id"));
        }
    });

    let obj_id = {"posts_id":JSON.stringify(checkListID)};

    $.ajax({
        type: 'POST',
        url: '/admins/posts',
        dataType: 'json',
        data: obj_id,
        success: location.reload()
    });
}

function fb_createErrorMessage() {
    output = "Der er sket en fejl. Kontakt Sebastian Andreasen på sebastian.sommersted@live.dk";
    $("#fb_post_list").append(output);
}
