/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// THIS ROUTE IS USED FOR EXPORING JSON DATA TO CLIENTSIDE SCRIPTS //

// ENSURE USER IS LOGGED IN AS USER
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','Du er ikke logget ind');
        res.redirect('/login');
    }
}


// SEATGROUP DATA - "STRICT FILTERED"
var Group = require('../models/seatingGroups');
router.get('/seatgroups', /*ensureAuthenticated,*/ function(req, res) {
    Group.find({},{password:0, createdAt:0, __v:0}, function(err, seatgroups){
        if(err) throw err;
        delete seatgroups.password;
        res.json(seatgroups);
    });
});


// USER DATA - "STRICT FILTERED"
var User = require('../models/user');
router.get('/users', /*ensureAuthenticated,*/ function(req, res) {
    User.find({},{password:0, isAdmin:0, email:0, studie:0, __v:0}, function(err, users){
        if(err) throw err;
        res.json(users);
    });
});


// SEATS DATA - "STRICT FILTERED"
var seats = require('../models/seats');
router.get('/seats', /*ensureAuthenticated,*/ function(req, res) {
    seats.find({},{__v:0}, function(err, seats){
        if(err) throw err;
        res.json(seats);
    });
});

/*
// TOURNAMENTS DATA - "STRICT FILTERED"
var Tournaments = require('../models/tournaments'); //TODO: MODEL SKAL OPRETTES
router.get('/tournaments', /!*ensureAuthenticated,*!/ function(req, res) {
    tours.find({},{__v:0}, function(err, tours){
        if(err) throw err;
        res.json(tours);
    });
});


// SPONSORS DATA - "STRICT FILTERED"
var Sponsors = require('../models/sponsors'); //TODO: MODEL SKAL OPRETTES
router.get('/sponsors', /!*ensureAuthenticated,*!/ function(req, res) {
    sponsor.find({},{__v:0}, function(err, sponsor){
        if(err) throw err;
        res.json(sponsor);
    });
});
*/


// ACTIVE USER LOGIN DATA - NO FILTERING
router.get('/user', /*ensureAuthenticated,*/ function(req, res) {
    if (req.user){
        let safe_user = req.user;
        safe_user.password = 0;
        res.json(safe_user);
    } else {
        res.json("You need to be logged in before requesting user data");
    }
});




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



// USER DATA - "NONSTRICT FILTERED"
router.get('/users/admin', /*ensureAdminAuthenticated,*/ function(req, res) {
    User.find({},{password:0, __v:0}, function(err, users){
        if(err) throw err;
        res.json(users);
    });
});


module.exports = router;