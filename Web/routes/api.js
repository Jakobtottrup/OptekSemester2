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
FB.setAccessToken('EAACEdEose0cBAAZBNliZAmXLAmYjHQKsyFTAZCtfkWLXgtewiOqi3SvSjcPPERXt2uoa265ydN4V2DGdC1ZCsVOWaewxMGgZCb5ZAq6nwrVcGxJxCeosgdrqTC4FmcpWxRwKrRpKjk9ZAZCRqdIdtyiCwXWTGdeYEoszt0KfMtHI0DG5VUJSUbEU');  // Siden læses på vegne af Christian Skjerning's Access Token..



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
    FB.api('247667268610623/feed', function (response) {
        if(!response || response.error) {
            console.log(!response ? 'error occurred' : response.error);
            return;
        }
        res.json(response);
    });
});


router.get('/fb_set', function(req, res){
    Fb_post.find({},{__v:0}, function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});





module.exports = router;
