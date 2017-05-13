/**
 * Created by Christian Skjerning on 5/11/2017.
 */

function getFacebookData() {
    return $.ajax({
        type: 'GET',
        url: "/api/fb_admin",
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
    var thismessage = "<div class='fb_message_text'>";

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

function fb_photo(thispost) {
    return "<img src='" + thispost.picture + "' title='" + thispost.name + "'>";
}

function fb_event(thispost) {
    var thisevent = "<a href='" + thispost.link + "'><img src='" + thispost.picture + "' title='" + thispost.name + "'></a>";
    return thisevent;
}

function fb_link(thispost) {
    var thislink = "<a href='" + thispost.link + "'><img src='" + thispost.picture + "' title='" + thispost.name + "'></a>";
    return thislink;
}

/*** * those I use * ***/
/** content functions **/
/*** *************** ***/

function fb_post_head(item) {
    return "<img src='http://graph.facebook.com/" + item.id + "/picture?type=square' title='" + item.name + "'>";
}

function fb_comment_head(item) {
    return "<img src='http://graph.facebook.com/" + item.id + "/picture?type=square' title='" + item.name + "'>";
}

function fb_comment(item) {
    var thiscomment = "<div class='fb_comment'>";
    thiscomment += convertToText(item.message);
    thiscomment += "</div>";

    return thiscomment;
}

function fb_likes(likes) {
    var thislikes = "<div class='fb_likes'>";

    likes.data.forEach(function (item) {
        thislikes += "<img src='http://graph.facebook.com/" + item.id + "/picture?type=square' title='" + item.name + "'>";
    });

    thislikes += "</div>";
    return thislikes;
}

/** those I truly use ***/
/** content functions **/
/*** *************** ***/

function fb_created_time(time) {
    return "Tid: " + time;
}

function fb_user_pic(user) {
    return "<img src='http://graph.facebook.com/" + user.id + "/picture?type=square' title='" + user.name + "'>";
}

function fb_post_large(post) {
    //name, date, text
    var text = "";

    text += "<div class='fb_post'>";
    text += "<p>" + post.from.name + "</p>";
    text += "<p>" + fb_created_time(post.created_time) + "</p>";
    text += fb_post_text(post);
    text += "</div>";

    return text;
}

function fb_post_medium(post) {
    //pic, name, date, text
    var text = "";

    text += "<div class='fb_post'>";
    text += fb_user_pic(post.from);
    text += "<p>" + post.from.name + "</p>";
    text += "<p>" + fb_created_time(post.created_time) + "</p>";
    text += fb_post_text(post);
    text += "</div>";

    return text;
}

function fb_post_small(post) {
    //pic, name, date, text
    var text = "";

    text += "<div class='fb_post'>";
    text += fb_user_pic(post.from);
    text += "<p>" + post.from.name + "</p>";
    text += "<p>" + fb_created_time(post.created_time) + "</p>";
    text += fb_post_text(post);
    text += "</div>";

    return text;
}

function fb_post_text(post) {
    var text = "";

    text += "<p>" + convertToText(post.message); + "</p>";
    if (post.type == "photo") {
        text += fb_photo(post);
    } else if (post.type == "event") {
        text += fb_event(post);
    } else if (post.type == "link") {
        text += fb_link(post);
    } else {
        //console.log(post.type);
    }

    return text;
}

function fb_comment_text(comment) {
    var text = "";

    text += "<p>" + convertToText(comment.message); + "</p>";

    return text;
}

function fb_comment_large(comment) {
    //name, date, text
    var text = "";

    text += "<div class='fb_comment'>";
    text += "<p>" + comment.from.name + "</p>";
    text += "<p>" + fb_created_time(comment.created_time) + "</p>";
    text += fb_comment_text(comment);
    text += "</div>";

    return text;
}

function fb_comment_medium(comment) {
    //pic, name, date, text
    var text = "";

    text += "<div class='fb_comment'>";
    text += fb_user_pic(comment.from);
    text += "<p>" + comment.from.name + "</p>";
    text += "<p>" + fb_created_time(comment.created_time) + "</p>";
    text += fb_comment_text(comment);
    text += "</div>";

    return text;
}

function fb_comment_small(comment) {
    //pic, name, date, text
    var text = "";

    text += "<div class='fb_comment'>";
    text += fb_user_pic(comment.from);
    text += "<p>" + comment.from.name + "</p>";
    text += "<p>" + fb_created_time(comment.created_time) + "</p>";
    text += fb_comment_text(comment);
    text += "</div>";

    return text;
}

/*** ********** ***/
/** create posts **/
/*** ********** ***/

function fb_createPosts() {
    fbData.data.forEach(fb_thispost);
}

function fb_thispost(post) {
    console.log(post);
    output = "";

    output += "<table border='1'>";

    output += "<tr>";

    output += "<td class='hidden-sm hidden-xs fb_tb_left'>";
    output += fb_user_pic(post.from);
    output += "</td>";

    output += "<td class='hidden-xs hidden-sm'>";
    output += fb_post_large(post);
    output += "</td>";

    output += "<td class='visible-sm'>";
    output += fb_post_medium(post);
    output += "</td>";

    output += "<td class='visible-xs'>";
    output += fb_post_small(post);
    output += "</td>";

    output += "<td rowspan='2' class='visible-lg visible-xl fb_tb_right'>";
    output += "</td>";

    output += "</tr>";



    output += "<tr>";

    output += "<td  class='hidden-sm hidden-xs fb_tb_left'>";
    output += "</td>";

    output += "<td>";
    if (typeof post.likes !== "undefined") {
        output += fb_likes(post.likes);
    }
    output += "</td>";

    output += "</tr>";

    if (typeof post.comments !== "undefined") {
        post.comments.data.forEach(function (comment) {
            if (comment.message.length > 0) {
                output += "<tr>";

                output += "<td class='visible-lg visible-xl fb_tb_left'>";
                output += "</td>";

                output += "<td class='visible-md fb_tb_left'>";
                output += fb_user_pic(comment.from);
                output += "</td>";

                output += "<td class='hidden-xs hidden-sm'>";
                output += fb_comment_large(comment);//"com name 0, com date 0, com tekst 0";
                output += "</td>";

                output += "<td class='visible-sm'>";
                output += fb_comment_medium(comment);//"com pic 1, com name 1, com date 1, com tekst 1";
                output += "</td>";

                output += "<td class='visible-xs'>";
                output += fb_comment_small(comment);//"com pic 2, com name 2, com date 2, com tekst 2";
                output += "</td>";

                output += "<td class='visible-lg visible-xl fb_tb_right'>";
                output += fb_user_pic(comment.from);
                output += "</td>";

                output += "</tr>";
            }
        });
    }

    output += "</table>";

    output += "<br>";











    /*
    output += "<table class='fb_tb_post'>";
        output += "<tr class='fb_tb_message'>";
            output += "<td class='fb_tb_left hidden-xs'>";
                output += "<div class='fb_left'>" + fb_post_head(post.from) + "</div>";
            output += "<td>";
            output += "<td class='fb_tb_center' colspan='2'>";
                output += "<div class='fb_message'>" + fb_message(post) + "</div>";
            output += "<td>";
            output += "<td class='fb_tb_right hidden-xs'>";
                output += "<div class='fb_right'>" + "right" + "</div>"
            output += "<td>";
        output += "</tr>";


    if (typeof post.likes !== "undefined") {

        output += "<tr class='fb_tb_likes'>";
        output += "<td class='fb_tb_left hidden-xs'>";
        output += "<div class='fb_left'>" + "left" + "</div>";
        output += "<td>";
        output += "<td class='fb_tb_center' colspan='2'>";
        output += "<div class='fb_likes'>" + fb_likes(post.likes) + "</div>";
        output += "<td>";
        output += "<td class='fb_tb_right hidden-xs'>";
        output += "<div class='fb_right'>" + "right" + "</div>"
        output += "<td>";
        output += "</tr>";
    }


    if (typeof post.comments !== "undefined") {
        post.comments.data.forEach(function (item) {
            if (item.message.length > 0) {
                output += "<tr class='fb_tb_comment'>";
                output += "<td class='fb_tb_left hidden-xs'>";
                output += "<div class='fb_left'>" + "left" + "</div>";
                output += "<td>";
                output += "<td class='fb_tb_center'>";
                output += "<div class='fb_comment'>" + fb_comment(item) + "</div>";
                output += "<td>";
                output += "<td class='fb_tb_right hidden-xs'>";
                output += "<div class='fb_right'>" + fb_comment_head(item.from) + "</div>"
                output += "<td>";
                output += "</tr>";
            }
        });
    }


    output += "</table>";

    output += "<br>";






*/

























    /*
    output = "<div class='fb_container'>";
        output += "<div class='fb_post_container'>";
            output += fb_message(post);
            if (post.type == "photo") {
                output += fb_photo(post);
            } else if (post.type == "event") {
                output += fb_event(post);
            } else if (post.type == "link") {
                output += fb_link(post);
            } else {
                //console.log(post.type);
            }
            output += fb_posttime(post.created_time);
        output += "</div>";
        if (typeof post.likes !== "undefined") {
            output += fb_likes(post.likes);
        }
        if (typeof post.comments !== "undefined") {
            output += fb_comments(post.comments);
        }
    output += "</div>";*/
    $("#facebookposts").append(output);
}
