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
        groupData = seatgroups;
        res.json({data: groupData})
    });
});


// USER DATA
var User = require('../models/user');
router.get('/users', ensureAuthenticated, function(req, res) {
    User.find({}, function(err, users){
        if(err) throw err;
        userData = users;
        res.json({data: userData})
    });
});


// SEATS DATA
var seats = require('../models/seats');
router.get('/seats', ensureAuthenticated, function(req, res) {
    User.find({}, function(err, seats){
        if(err) throw err;
        seatsData = seats;
        res.json({data: seatsData})
    });
});


module.exports = router;