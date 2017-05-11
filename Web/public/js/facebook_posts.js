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
    fb_createPosts();
});

/*** ******* ***/
/** functions **/
/*** ******* ***/

function fb_message(message) {
    var thismessage = "<div class='fb_message'><p>";
    for (var i = 0; i < message.length; i++) {
        if (message.charCodeAt(i) == 10) {
            thismessage += "</p><p>";
        } else {
            thismessage += message.charAt(i);
        }
    }
    thismessage += "</p></div>";
    return thismessage;
}

function fb_posttime(time) {
    var thistime = "<div class='fb_posttime'>";

    thistime += time;

    thistime += "</div>";

    return thistime;
}

function fb_likes(likes) {
    var thislikes = "<div class='fb_likes'>";

    likes.data.forEach(function (item) {
        thislikes += "<img src='http://graph.facebook.com/" + item.id + "/picture?type=square' title='" + item.name + "'>";
    });

    thislikes += "</div>";
    return thislikes;
}

function fb_comments(comments) {
    console.log(comments);
    var thiscomment = "<div class='fb_comments'>";

    comments.data.forEach(function (item) {
        thiscomment += "<p>" + item.message + "</p>";
    });

    thiscomment += "</div>";
    return thiscomment;
}

/*** ********** ***/
/** create posts **/
/*** ********** ***/

function fb_createPosts() {
    fbData.data.forEach(fb_thispost);
}

function fb_thispost(post) {
    console.log(post);
    output = "<div class='fb_container'>";

    output += fb_message(post.message);
    output += fb_posttime(post.created_time);

    if (typeof post.likes !== "undefined") {
        output += fb_likes(post.likes);
    }

    if (typeof post.comments !== "undefined") {
        output += fb_comments(post.comments);
    }



    output += "</div>";
    $("#facebookposts").append(output);
}
