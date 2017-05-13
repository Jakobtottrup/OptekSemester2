/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const fs = require('fs');

// REQUIRE MONGOOSE MODELS
const Group = require('../models/seatingGroups');
const User = require('../models/user');
const seats = require('../models/seats');
const Event = require('../models/event');
const Sponsors = require('../models/sponsors');
const Tournaments = require('../models/tournaments');
const Fb_post = require('../models/fb_posts');
const FB = require('FB');


/** FACEBOOK ACCESS TOKEN INFORMATION - v2.9
 *  GUIDE : http://stackoverflow.com/questions/17197970/facebook-permanent-page-access-token
 *
 *  S7LAN PAGE/ACCOUNT ID :     247667268610623
 *  S7LAN APP ID :              658376531024359
 *  S7LAN APP SECRET :          f89bf31e6dfef146ce8e423a168f4786
 *  SHORT-LIVED TOKEN ID :      EAAJWyjtCmecBAEUjaecF42LiYjv4PIHmy3FUmj8EDZBZAcqf7o4gVWERNWZBlEROoeDDivb3iaBZCCMuzFQmEgMPmRmJZAQX7xLQG0x3ljv0FHZCz3Whq9rN03ORurU1zYet1OGcLvKE8f8Jx5ODPjFLaY3k6WBRkLwAs2Lrca9dzcy2FbUojg
 *
 *  URL TEMPLATE FOR 'GET' REQUESTING LONG-LIVED TOKEN ID :     https://graph.facebook.com/v2.9/oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_lived_token}
 *  URL TEMPLATE FOR 'GET' REQUESTING ACCOUNT ID :              https://graph.facebook.com/v2.9/me?access_token={long_lived_access_token}
 *  URL TEMPLATE FOR 'GET' REQUESTING PERMANENT TOKEN ID :      https://graph.facebook.com/v2.9/{account_id}/accounts?access_token={long_lived_access_token}
 *                                                              https://graph.facebook.com/v2.9/me/accounts?access_token=long_lived_access_token
 *
 *
 *  **** FOLLOWING TOKENS BELONGS TO CHRISTIAN SKJERNING AND DOES NOT WORK ANY MORE, NEW TOKENS NEEDS TO BE GENERATED ****
 *  LONG-LIVED TOKEN URL :      https://graph.facebook.com/v2.9/oauth/access_token?grant_type=fb_exchange_token&client_id=658376531024359&client_secret=f89bf31e6dfef146ce8e423a168f4786&fb_exchange_token=EAAJWyjtCmecBAONsIxb4c8an2lJmWdHkjbCiEdva7sqHmJrsyX3x1Y7aT0xxanCYZBlgXu4WGARfLnE9SPZAr8lsq3m0j3hYgndGfP1i3vFBH29K1KCL8YgHPJw6KoxeXZAQ6XgIK0qJ32qbg11AbZAoZA9sbMJcVlRUH0QTLOtTZCy8ZBzJyDZBwsbbLWZC9LiAZD
 *  LONG-LIVED TOKEN ID :       EAAJWyjtCmecBAHYFf8IaW37yZC9Q3l9nzAjn5eT13paG7eZBw1ZAn94ZAXSeyYYEwWzzmk8NsranZAtLxxwChbpZAmE0xxRulVc2idLFHsBku4PTpuOUFDzdtwHvMPwnshvwPisTTY7nZCsODFRv1ZAcjbKISojlvmoZD
 *
 *  ACCOUNT ID URL :            https://graph.facebook.com/v2.9/me?access_token=EAAJWyjtCmecBAHYFf8IaW37yZC9Q3l9nzAjn5eT13paG7eZBw1ZAn94ZAXSeyYYEwWzzmk8NsranZAtLxxwChbpZAmE0xxRulVc2idLFHsBku4PTpuOUFDzdtwHvMPwnshvwPisTTY7nZCsODFRv1ZAcjbKISojlvmoZD
 *  ACCOUNT ID :                247667268610623
 *
 *  URL FOR PERMANENT TOKEN :   https://graph.facebook.com/v2.9/247667268610623/accounts?access_token=EAAJWyjtCmecBAHYFf8IaW37yZC9Q3l9nzAjn5eT13paG7eZBw1ZAn94ZAXSeyYYEwWzzmk8NsranZAtLxxwChbpZAmE0xxRulVc2idLFHsBku4PTpuOUFDzdtwHvMPwnshvwPisTTY7nZCsODFRv1ZAcjbKISojlvmoZD // does not work with page id... more to come...
 *  PERMANENT TOKEN ID:
 */

FB.setAccessToken('EAAJWyjtCmecBAHYFf8IaW37yZC9Q3l9nzAjn5eT13paG7eZBw1ZAn94ZAXSeyYYEwWzzmk8NsranZAtLxxwChbpZAmE0xxRulVc2idLFHsBku4PTpuOUFDzdtwHvMPwnshvwPisTTY7nZCsODFRv1ZAcjbKISojlvmoZD');  // expires Wed, 12 Jul 2017 02:56:24 (Danish summer time)



// THIS ROUTE IS USED FOR EXPORING JSON DATA TO CLIENTSIDE SCRIPTS //
// ENSURE USER IS LOGGED IN
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Du er ikke logget ind');
        res.redirect('/login');
    }
}


// ACTIVE USER LOGIN DATA
router.get('/localuser', function(req, res) {
    if (req.user){
        req.user.password = 0;
        res.json(req.user);
    } else {

        //req.flash('error_msg','Du er ikke logget ind');
        res.json(null);
    }
});


// USERS INFORMATION
router.get('/users', function (req, res) {
    if (typeof req.user === "object" && req.user.isAdmin === true) {    // IF USER REQUESTING IS LOGGED IN AS ADMIN - ADMIN
        User.find({},{__v:0, password:0, resetPasswordExpires:0, resetPasswordToken:0}, function(err, data){
            if(err) throw err;
            res.json(data);
        });
    } else if (typeof req.user === "object") {                          // IF USER REQUESTING IS NOT ADMIN - USER
        User.find({},{__v:0, password:0, resetPasswordExpires:0, resetPasswordToken:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    } else {                                                            // IF THERE IS NO USER LOGGED IN - PUBLIC
        User.find({},{__v:0, password:0, age:0, email:0, studie:0, steam:0, bnet:0, isAdmin:0, fakultet:0, hasPaid:0, resetPasswordExpires:0, resetPasswordToken:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    }
});

// SEATS INFORMATION
router.get('/seats', function (req, res) {
    if (typeof req.user === "object" && req.user.isAdmin === true) {    // IF USER REQUESTING IS LOGGED IN AS ADMIN - ADMIN
        seats.find({},{__v:0, _id:0}, function(err, data){
            if(err) throw err;
            res.json(data);
        });
    } else if (typeof req.user === "object") {                          // IF USER REQUESTING IS NOT ADMIN - USER
        seats.find({},{__v:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    } else {                                                            // IF THERE IS NO USER LOGGED IN - PUBLIC
        seats.find({},{__v:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    }
});


// SEATGROUPS INFORMATION
router.get('/seatgroups', function (req, res) {
    if (typeof req.user === "object" && req.user.isAdmin === true) {    // IF USER REQUESTING IS LOGGED IN AS ADMIN - ADMIN
        Group.find({},{__v:0, password:0}, function(err, data){
            if(err) throw err;
            res.json(data);
        });
    } else if (typeof req.user === "object") {                          // IF USER REQUESTING IS NOT ADMIN - USER
        Group.find({},{__v:0, password:0, createdAt:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    } else {                                                            // IF THERE IS NO USER LOGGED IN - PUBLIC
        req.flash('error_msg', 'Du er ikke logget ind');
        res.redirect('/login');
    }
});


// SPONSORS INFORMATION
router.get('/sponsors', function (req, res) {
    if (typeof req.user === "object" && req.user.isAdmin === true) {    // IF USER REQUESTING IS LOGGED IN AS ADMIN - ADMIN
        Sponsors.find({},{__v:0}, function(err, data){
            if(err) throw err;
            res.json(data);
        });
    } else if (typeof req.user === "object") {                          // IF USER REQUESTING IS NOT ADMIN - USER
        Sponsors.find({},{__v:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    } else {                                                            // IF THERE IS NO USER LOGGED IN - PUBLIC
        Sponsors.find({},{__v:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    }
});


// TOURNAMENTS INFORMATION
router.get('/tournaments', function (req, res) {
    if (typeof req.user === "object" && req.user.isAdmin === true) {    // IF USER REQUESTING IS LOGGED IN AS ADMIN - ADMIN
        Tournaments.find({},{__v:0}, function(err, data){
            if(err) throw err;
            res.json(data);

        });
    } else if (typeof req.user === "object") {                          // IF USER REQUESTING IS NOT ADMIN - USER
        Tournaments.find({},{__v:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    } else {                                                            // IF THERE IS NO USER LOGGED IN - PUBLIC
        Tournaments.find({},{__v:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    }
});


// EVENT INFORMATION
router.get('/event', function (req, res) {
    if (typeof req.user === "object" && req.user.isAdmin === true) {    // IF USER REQUESTING IS LOGGED IN AS ADMIN - ADMIN
        Event.find({},{__v:0}, function(err, data){
            if(err) throw err;
            res.json(data);
        });
    } else if (typeof req.user === "object") {                          // IF USER REQUESTING IS NOT ADMIN - USER
        Event.find({},{__v:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    } else {                                                            // IF THERE IS NO USER LOGGED IN - PUBLIC
        Event.find({},{__v:0}, function(err, data) {
            if (err) throw err;
            res.json(data);
        });
    }
});


// GALLERY IMAGES
const galleryFolder = './public/uploads/image/gallery';
router.get('/gallery', function (req, res) {
    fs.readdir(galleryFolder, (err, files) => {
        res.json(files);
    });
});


// GET FACEBOOK POSTS
router.get('/fb', function(req, res) {
    FB.api(
        '/247667268610623/feed',
        'GET',
        { fields: ['id, from{name, category, category_list}, message, message_tags, picture, link, name, caption, description, icon, ' +
        'actions{name, link, id}, privacy, type, status_type, created_time, updated_time, is_hidden, subscribed, is_expired, admin_creator,' +
        'comments{created_time, from, message, can_remove, like_count, user_likes, id}, likes{id, name}, story, story_tags, full_picture, ' +
        'object_id, shares, place, backdated_time']},
        function(response) {
            res.json(response);
        }
    );


});


router.get('/fb_set', function(req, res){
    Fb_post.find({},{__v:0}, function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});





module.exports = router;
