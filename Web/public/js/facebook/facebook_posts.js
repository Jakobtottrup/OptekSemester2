/**
 * Created by ste on 05-11-2017.
 */



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

function fb_photo(thispost) {
    return "<img src='" + thispost.picture + "' title='" + thispost.name + "'>";
}

function fb_event(thispost) {
    var thisevent = "<a href='" + thispost.link + "'><img src='" + thispost.picture + "' title='" + thispost.name + "'></a>";
    return thisevent;
}

function fb_link(thispost) {
    var thislink = "<a href='" + thispost.link + "'>";

    if (typeof thispost.picture !== "undefined") {
        thislink += "<img src='" + thispost.picture + "' title='" + thispost.name + "'>";
    } else {
        thislink += "Se linket her";
    }

    thislink += "</a>";
    return thislink;
}

function collapse_likes_list(thisid) {
    //console.log("click " + thisid);

    $("#" + thisid).slideToggle( "slow", function() {
        //animation end
    });
}

function fb_likes(likes, postnum) {
    var pic_max = 5;
    var pic_count;

    var thislikes = "<div class='fb_likes_container'><div class='fb_likes'>";

    if (likes.data.length > pic_max) {
        thislikes += "<button type='button' class='fb_likes_plus' onclick='collapse_likes_list(" + postnum + ")'>+" + (likes.data.length - pic_max + 1) + "</button>";
    }

    pic_count = 0;
    likes.data.forEach(function (item) {
        if (pic_count < pic_max - 1 || (pic_max == likes.data.length)) {
            thislikes += "<img src='http://graph.facebook.com/" + item.id + "/picture?type=square' title='" + item.name + "'>";
        }
        pic_count++;
    });

    thislikes += "</div></div>";

    if (likes.data.length > pic_max) {
        thislikes += "<div class='fb_likes_list' id='" + postnum + "'>";

        pic_count = 0;
        likes.data.forEach(function (item) {
            if (pic_count >= pic_max - 1) {
                thislikes += "<p>";
                thislikes += "<img src='http://graph.facebook.com/" + item.id + "/picture?type=square' title='" + item.name + "'>";
                thislikes += "</p>";
            }
            pic_count++;
        });

        thislikes += "</div>";
    }

    return thislikes;
}

function fb_created_time(time) {
    return convertTimeWithYear(time);
}

function fb_user_pic(user) {
    return "<img src='http://graph.facebook.com/" + user.id + "/picture?type=square' title='" + user.name + "'>";
}

function fb_post_large(post) {
    //name, date, text
    var text = "";

    text += "<div class='fb_post'>";

    text += "<div style='clear: both;' class='date_box_large'>";
    text += "<p class='name_align_left'>" + post.from.name + "</p>";
    text += "<p class='date_align_right'>" + fb_created_time(post.created_time) + "</p>";
    text += "</div>";

    text += fb_post_text(post);
    text += "</div>";

    return text;
}

function fb_post_small(post) {
    //pic, name, date, text
    var text = "";

    text += "<div class='fb_post'>";

    text += "<div style='clear: both;' class='date_box_small'>";

    text += "<div class='date_box_small_left'>";
    text += fb_user_pic(post.from);
    text += "</div>";

    text += "<div class='date_box_small_right'>";
    text += "<p>" + post.from.name + "</p>";
    text += "<p>" + fb_created_time(post.created_time) + "</p>";
    text += "</div>";

    text += "</div>";

    text += fb_post_text(post);
    text += "</div>";

    return text;
}

function fb_post_text(post) {
    var text = "";

    text += "<p>" + convertToText(post.message); + "</p>";

    text += "<div class='fb_link_pic' align='center'>";
    if (post.type == "photo") {
        text += fb_photo(post);
    } else if (post.type == "event") {
        text += fb_event(post);
    } else if (post.type == "link") {
        text += fb_link(post);
    } else {
        //console.log(post.type);
    }
    text += "</div>";

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

    text += "<div style='clear: both;' class='date_box_large'>";
    text += "<p class='name_align_left'>" + comment.from.name + "</p>";
    text += "<p class='date_align_right'>" + fb_created_time(comment.created_time) + "</p>";
    text += "</div>";

    text += fb_comment_text(comment);
    text += "</div>";

    return text;
}

function fb_comment_small(comment) {
    //pic, name, date, text
    var text = "";

    text += "<div class='fb_comment'>";

    text += "<div style='clear: both;' class='date_box_small'>";

    text += "<div class='date_box_small_left'>";
    text += fb_user_pic(comment.from);
    text += "</div>";

    text += "<div class='date_box_small_right'>";
    text += "<p>" + comment.from.name + "</p>";
    text += "<p>" + fb_created_time(comment.created_time) + "</p>";
    text += "</div>";

    text += "</div>";

    text += fb_comment_text(comment);
    text += "</div>";

    return text;
}

/*** ********** ***/
/** create posts **/
/*** ********** ***/

function fb_createPosts() {
    for (var i = 0; i < fbData.data.length; i++) {
        fb_thispost(fbData.data[i], i);
    }
}

function fb_thispost(post, post_num) {
    //console.log(post);
    post_num *= 2;

    output = "";

    output += "<table border='0'>";

    output += "<tr>";

    output += "<td class='hidden-xs fb_tb_left fb_creater_pic'>"; //hidden-sm
    output += fb_user_pic(post.from);
    output += "</td>";

    output += "<td class='hidden-xs'>"; // hidden-sm
    output += fb_post_large(post);
    if (typeof post.likes !== "undefined") {
        output += fb_likes(post.likes, post_num);
    }
    output += "</td>";

    post_num++;

    output += "<td class='visible-xs'>";
    output += fb_post_small(post);
    if (typeof post.likes !== "undefined") {
        output += fb_likes(post.likes, post_num);
    }
    output += "</td>";

    output += "<td class='visible-lg visible-xl fb_tb_right'>";
    output += "</td>";

    output += "</tr>";

    if (typeof post.comments !== "undefined") {
        post.comments.data.forEach(function (comment) {
            if (comment.message.length > 0) {
                output += "<tr>";

                output += "<td class='visible-lg visible-xl fb_tb_left'>";
                output += "</td>";

                output += "<td class='visible-sm visible-md fb_tb_left fb_comment_pic_left'>";
                output += fb_user_pic(comment.from);
                output += "</td>";

                output += "<td class='hidden-xs'>";
                output += fb_comment_large(comment);//"com name 0, com date 0, com tekst 0";
                output += "</td>";

                output += "<td class='visible-xs'>";
                output += fb_comment_small(comment);//"com pic 2, com name 2, com date 2, com tekst 2";
                output += "</td>";

                output += "<td class='visible-lg visible-xl fb_tb_right fb_comment_pic_right'>";
                output += fb_user_pic(comment.from);
                output += "</td>";

                output += "</tr>";
            }
        });
    }

    output += "</table>";

    $("#facebookposts").append(output);
}
