/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// THIS ROUTE IS USED FOR EXPORING JSON DATA TO CLIENT //

// ENSURE USER IS LOGGED IN
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','Du er ikke logget ind');
        res.redirect('/login');
    }
}


// SEATGROUP DATA
var Group = require('../models/seatingGroups');
router.get('/seatgroups', ensureAuthenticated, function(req, res) {
    Group.find({}, function(err, seatgroups){
        if(err) throw err;
        res.json(seatgroups)
    });
});


// USER DATA
var User = require('../models/user');
router.get('/users', ensureAuthenticated, function(req, res) {
    User.find({}, function(err, users){
        if(err) throw err;
        res.json(users)
    });
});


// SEATS DATA
var seats = require('../models/seats');
router.get('/seats', ensureAuthenticated, function(req, res) {
    User.find({}, function(err, seats){
        if(err) throw err;
        res.json(seats)
    });
});


// ACTIVE USER LOGIN DATA
router.get('/user', ensureAuthenticated, function(req, res) {
    res.json(req.user)
});

module.exports = router;