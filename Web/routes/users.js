/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
//var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// THESE VIEWS ARE ONLY ALLOWED IF USER IS LOGGED IN //

// CHECK IF USER TRIES TO ENTER UNALLOWED ROUTE





/*
// USER DASHBOARD
router.get('/userpanel', ensureAuthenticated, function(req, res){
    res.render('user-backend/usersDashboard', {title: "Dashboard"});
});
*/

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','Du er ikke logget ind');
        res.redirect('/login');
    }
}

// USER INFO
router.get('/userinfo', function(req, res){
    res.render('user-backend/userinfo', {title: "Bruger info"});
});


// USER TOURNAMENTS
router.get('/usertournaments', function(req, res){
    res.render('user-backend/usertournaments', {title: "Dine Turneringer"});
});


// USER SEAT
router.get('/getseat', function(req, res){
    res.render('user-backend/getseat', {title: "Din plads"});
});


// RENDER SEATGROUP VIEW
router.get('/seatgroups', function(req, res){
    // GET SEATGROUPS
    Group.find({}, function(err, seatgroups){
        if(err) throw err;
        groupData = seatgroups;
        res.render('user-backend/seatgroups', {title: "Siddegrupper", data: groupData});
    });
});


// REGISTER GROUP
var Group = require('../models/seatingGroups');
router.post('/seatgroups', function(req, res){
    var groupName = req.body.groupName;
    var password = req.body.password;
    var password2 = req.body.password2;
    var members = [];
    var leaderID = req.user.id;


    // VALIDATION
    req.checkBody('groupName', 'Gruppenavn er nødvendigt').notEmpty();
    req.checkBody('password', 'Kodeord er nødvendigt').notEmpty();
    req.checkBody('password2', 'Tjek venligst at kodeordene stemmer overens').equals(req.body.password);


    var errors = req.validationErrors();
    if(errors){ // if validation fails
        res.render('frontend/index',{
            errors:errors
        });
        console.log(errors);
    } else { //if validation succeeds server sends data to database using modelschema "users.js"
        var newGroup = new Group({
            groupName: groupName,
            password: password,
            members: members,
            leaderID: leaderID
        });

        Group.createGroup(newGroup, function(err, group){
            if(err) throw err;
            //console.log(group);
        });
        req.flash('success_msg', 'Gruppen er nu oprettet');
        res.redirect('/users/seatgroups');
    }
});


module.exports = router;