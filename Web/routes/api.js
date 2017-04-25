/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// REQUIRE MONGOOSE MODELS
const Group = require('../models/seatingGroups');
const User = require('../models/user');
const seats = require('../models/seats');
const Event = require('../models/event');
const Sponsors = require('../models/sponsors');
const Tournaments = require('../models/tournaments');


// THIS ROUTE IS USED FOR EXPORING JSON DATA TO CLIENTSIDE SCRIPTS //

//**** USE THESE API KEYS IN PUBLIC PAGES ONLY ****//
// SEATS DATA
router.get('/seats/public', function(req, res) {
    seats.find({},{__v:0}, function(err, seats){
        if(err) throw err;
        res.json(seats);
    });
});

// USERS DATA
router.get('/users/public', function(req, res) {
    User.find({},{password:0, isAdmin:0, email:0, studie:0, age:0, fakultet:0, steam:0, bnet:0, __v:0}, function(err, users){
        if(err) throw err;
        res.json(users);
    });
});

// SEATGROUP DATA
router.get('/seatgroups/public', function(req, res) {
    Group.find({},{password:0, createdAt:0, __v:0}, function(err, seatgroups){
        if(err) throw err;
        delete seatgroups.password;
        res.json(seatgroups);
    });
});

// SPONSORS DATA
router.get('/sponsors/public', function(req, res) {
    Sponsors.find({},{}, function(err, sponsors){
        if(err) throw err;
        res.json(sponsors);
    });
});

// TOURNAMENTS DATA
router.get('/tournaments/public', function(req, res) {
    Tournaments.find({},{}, function(err, tournaments){
        if(err) throw err;
        res.json(tournaments);
    });
});

// EVENT DATA
router.get('/event/public', function(req, res) {
    Event.find({},{}, function(err, event){
        if(err) throw err;
        res.json(event);
    });
});



//**** USE THESE API KEYS IN USER-BACKEND PAGES ONLY ****//

// ENSURE USER IS LOGGED IN AS USER
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','Du er ikke logget ind');
        res.redirect('/login');
    }
}

// SEATGROUP DATA
router.get('/seatgroups/user', ensureAuthenticated, function(req, res) {
    Group.find({},{password:0, createdAt:0, __v:0}, function(err, seatgroups){
        if(err) throw err;
        delete seatgroups.password;
        res.json(seatgroups);
    });
});


// USERS DATA
router.get('/users/user', ensureAuthenticated, function(req, res) {
    User.find({},{password:0, __v:0}, function(err, users){
        if(err) throw err;
        res.json(users);
    });
});

// SEATS DATA
router.get('/seats', ensureAuthenticated, function(req, res) {
    seats.find({},{__v:0}, function(err, seats){
        if(err) throw err;
        res.json(seats);
    });
});

// EVENT DATA
router.get('/event/user', ensureAuthenticated, function(req, res) {
    Event.find({},{__v:0}, function(err, event){
        if(err) throw err;
        res.json(event);
    });
});


//**** USE THESE API KEYS IN ADMIN-BACKEND PAGES ONLY ****//

// ENSURE USER IS LOGGED IN AS ADMIN
function ensureAdminAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.isAdmin === true){
            return next();
        } else if (req.user.isAdmin === false){
            req.flash('error_msg','Du har ikke de nødvendige rettigheder');
            res.redirect('/dashboard');
        }
    } else {
        req.flash('error_msg','Du er ikke logget ind');
        res.redirect('/login');
    }
}

// USER DATA
router.get('/users/admin', ensureAdminAuthenticated, function(req, res) {
    User.find({},{password:0, __v:0}, function(err, users){
        if(err) throw err;
        res.json(users);
    });
});

// SEATS DATA
router.get('/seats/admin', ensureAdminAuthenticated, function(req, res) {
    seats.find({},{__v:0}, function(err, seats){
        if(err) throw err;
        res.json(seats);
    });
});

// SEATGROUPS DATA
router.get('/seatgroups/admin', ensureAdminAuthenticated, function(req, res) {
    Group.find({},{__v:0, password:0}, function(err, seatgroups){
        if(err) throw err;
        res.json(seatgroups);
    });
});

// SPONSORS DATA
router.get('/sponsors/admin', ensureAdminAuthenticated, function(req, res) {
    Sponsors.find({},{__v:0}, function(err, sponsors){
        if(err) throw err;
        res.json(sponsors);
    });
});

// TOURNAMENTS DATA
router.get('/tournaments/admin', ensureAdminAuthenticated, function(req, res) {
    Tournaments.find({},{__v:0}, function(err, tournaments){
        if(err) throw err;
        res.json(tournaments);
    });
});

// EVENT DATA
router.get('/event/admin', ensureAdminAuthenticated, function(req, res) {
    Event.find({},{__v:0}, function(err, event){
        if(err) throw err;
        res.json(event);
    });
});


// ACTIVE USER LOGIN DATA
router.get('/localuser', ensureAuthenticated, function(req, res) {
    if (req.user){
        //let safe_user = req.user;
        delete req.user.password;
        res.json(req.user);
    } else {
        res.json("You need to be logged in before requesting user data");
    }
});





module.exports = router;