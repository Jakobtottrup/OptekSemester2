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
const FB = require('fb');

/** FACEBOOK ACCESS TOKEN INFORMATION - v2.9
 *  GET TOKEN GUIDE :   http://stackoverflow.com/questions/17197970/facebook-permanent-page-access-token
 *  TOKEN DEBUG :       https://developers.facebook.com/tools/debug/accesstoken/
 *  GRAPH API :         https://developers.facebook.com/tools/explorer
 *
 *  S7LAN PAGE/ACCOUNT ID :     247667268610623
 *  S7LAN APP ID :              658376531024359
 *  S7LAN APP SECRET :          f89bf31e6dfef146ce8e423a168f4786
 *  S7LAN APP CLIENT TOKEN :    ace86d4971fb01580378e091bc1b3b0b
 *  S7LAN APP TOKEN ID :        658376531024359|E2ZZMX7jZEoYcoFZluWhcn3FfdQ
 *
 *  URL TEMPLATE FOR 'GET' REQUESTING LONG-LIVED TOKEN ID :     https://graph.facebook.com/v2.9/oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_lived_token}
 *  URL TEMPLATE FOR 'GET' REQUESTING ACCOUNT ID :              https://graph.facebook.com/v2.9/me?access_token={long_lived_access_token}
 *  URL TEMPLATE FOR 'GET' REQUESTING PERMANENT TOKEN ID :      https://graph.facebook.com/v2.9/{account_id}/accounts?access_token={long_lived_access_token}
 *                                                              https://graph.facebook.com/v2.9/me/accounts?access_token={long_lived_access_token}
 */

FB.setAccessToken('658376531024359|E2ZZMX7jZEoYcoFZluWhcn3FfdQ');


function ensureAdminAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin === true) {
            return next();
        } else if (req.user.isAdmin === false) {
            req.flash('error_msg', 'Du har ikke de nødvendige rettigheder');
            res.redirect('/dashboard');
        }
    } else {
        req.flash('error_msg', 'Du er ikke logget ind');
        res.redirect('/login');
    }
}


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
        let _id = req.user.id;
        let username = req.user.username;
        let age = req.user.age;
        let email = req.user.email;
        let studie = req.user.studie;
        let fakultet = req.user.fakultet;
        let bnet = req.user.bnet;
        let steam = req.user.steam;
        let hasPaid = req.user.hasPaid;
        let isAdmin = req.user.isAdmin;
        let joined = req.user.createdAt;
        let isActive = req.user.isActive;

        if(req.user.isAdmin === true){
            res.json({_id, username, age, email, studie, fakultet, bnet, steam, hasPaid, isAdmin, joined, isActive});
        } else {
            res.json({_id, username, age, email, studie, fakultet, bnet, steam, hasPaid, joined, isActive});
        }
    } else {
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
            let newData = [];
            for(let i = 0; i < data.length; i++){
                if(data[i].hasPaid === true || data[i].isAdmin === true) {
                    let _id = data[i].id;
                    let username = data[i].username;
                    let age = data[i].age;
                    let email = data[i].email;
                    let studie = data[i].studie;
                    let fakultet = data[i].fakultet;
                    let bnet = data[i].bnet;
                    let steam = data[i].steam;
                    newData.push({_id, username, age, email, studie, fakultet, bnet, steam});
                }
            }
            res.json(newData);
        });
    } else {                                                            // IF THERE IS NO USER LOGGED IN - PUBLIC
        User.find({},{__v:0, password:0, age:0, email:0, studie:0, steam:0, bnet:0, isAdmin:0, fakultet:0, hasPaid:0, resetPasswordExpires:0, resetPasswordToken:0, createdAt:0, isActive:0}, function(err, data) {
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


let fb_fields = ['id, from{name}, message, picture, link, name, type, created_time,' +
'comments{created_time, from, message, id}, likes{id, name}'];

// GET FACEBOOK INFORMATION FOR ADMIN VIEW
router.get('/fb_admin', ensureAdminAuthenticated, function(req, res) {
    FB.api('/247667268610623/feed', 'GET',
        {
            fields: fb_fields},
        function (response) {
            if (typeof response.error === "undefined") {
                res.json(response);
            } else {
                res.json(null);
            }
        }
    );
});


// GET FACEBOOK INFORMATION FOR PUBLIC VIEW
router.get('/fb_user', function(req, res) {
    Fb_post.find({},{__v:0}, function(err, fb_posts) {
        if (err) throw err;
        let posts_id = fb_posts[0].posts_id;
        FB.api('/247667268610623/feed', 'GET',
            {fields: fb_fields},
            function (response) {
                if (typeof response.error === "undefined"){
                    // filtering response to match settings given by admins
                    let newResponse = [];
                    for(let i=0; i<posts_id.length;i++){
                        for(let j=0;j < response.data.length; j++){
                            if (response.data[j].id === posts_id[i]) {
                                newResponse.push(response.data[j]);
                            }
                        }
                    }
                    res.json({data:newResponse});
                } else {
                    console.log("request limit reached");
                    res.json(null);
                }
            }
        );
    });
});


module.exports = router;
