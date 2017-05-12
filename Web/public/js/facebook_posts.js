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

/*** ************* ***/
/** basic functions **/
/*** ************* ***/

function convertToText(text) {
    //replace 'nextline' with breakpoint
    var thistext = "<p>";
    for (var i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) == 10) {
            thistext += "</p><p>";
        } else {
            thistext += text.charAt(i);
        }
    }
    thistext += "</p>";

    var index_check = 0;

    while (index_check < thistext.length && index_check >= 0) {
        //set raw-text links as <a> links
        if (thistext.indexOf("http", index_check) > -1) {
            var link_start = thistext.indexOf("http", index_check);
            var link_nextSpace = thistext.indexOf(" ", link_start);
            var link_nextArrow = thistext.indexOf("<", link_start);

            var link_end = link_start;
            if (link_nextSpace >= 0 && link_nextArrow >= 0) {
                link_end = Math.min(link_nextSpace, link_nextArrow);
            } else {
                if (link_nextSpace >= 0) {
                    link_end = link_nextSpace;
                } else if (link_nextArrow >= 0) {
                    link_end = link_nextArrow;
                } else {
                    console.log("Couldn't find link-end");
                }
            }

            //console.log("Link at " + link_start + " -> " + link_end);

            var text_start = thistext.slice(0, link_start);
            var text_link = thistext.slice(link_start, link_end);
            var text_end = thistext.slice(link_end, thistext.length);

            var temptext = [
                text_start,
                "<a href='",
                text_link,
                "'>",
                text_link.slice(text_link.indexOf("/") + 2, text_link.indexOf("/", 8)),
                "</a>",
                text_end
            ];

            thistext = temptext.join("");

            index_check = link_end;
        } else {
            index_check = -1;
        }
    }



    return thistext;
}

/*** *************** ***/
/** content functions **/
/*** *************** ***/

function fb_message(thispost) {
    var thismessage = "<div class='fb_message'>";

    thismessage += "<img src='http://graph.facebook.com/" + thispost.from.id + "/picture?type=square' title='" + thispost.from.name + "'>";
    thismessage += "<p>" + thispost.from.name + "</p>";
    thismessage += convertToText(thispost.message);

    thismessage += "</div>";
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
    var thiscomment = "<div class='fb_comments'>";

    comments.data.forEach(function (item) {
        if (item.message.length > 0) {
            thiscomment += "<div class='fb_single_comment'>";

            thiscomment += "<img src='http://graph.facebook.com/" + item.from.id + "/picture?type=square' title='" + item.from.name + "'>";
            thiscomment += "<p>" + item.from.name + "</p>";
            thiscomment += "<p>" + item.created_time + "</p>";

            thiscomment += convertToText(item.message);

            thiscomment += "</div>";
        }
    });

    thiscomment += "</div>";
    return thiscomment;
}

function fb_photo(image) {
    return "<img src='" + image + "'>";
}

function fb_event(thispost) {
    var thisevent = "<a href='" + thispost.link + "'><img src='" + thispost.picture + "'></a>";
    return thisevent;
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
        output += "<div class='fb_post_container'>";
            output += fb_message(post);
            if (post.type == "photo") {
                output += fb_photo(post.picture);
            } else if (post.type == "event") {
                output += fb_event(post);
            }
            output += fb_posttime(post.created_time);
        output += "</div>";
        if (typeof post.likes !== "undefined") {
            output += fb_likes(post.likes);
        }
        if (typeof post.comments !== "undefined") {
            output += fb_comments(post.comments);
        }
    output += "</div>";
    $("#facebookposts").append(output);
}
