/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
//var LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// THESE VIEWS ARE ONLY ALLOWED IF USER IS LOGGED IN //

// ENSURE USER IS LOGGED IN
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','Du er ikke logget ind');
        res.redirect('/login');
    }
}


// USER INFO
router.get('/userinfo', ensureAuthenticated, function(req, res){
    res.render('user-backend/userinfo', {title: "Bruger info"});
});


// USER TOURNAMENTS
router.get('/usertournaments', ensureAuthenticated, function(req, res){
    res.render('user-backend/usertournaments', {title: "Dine Turneringer"});
});


// USER SEAT
router.get('/getseat', ensureAuthenticated, function(req, res){
    res.render('user-backend/getseat', {title: "Din plads"});
});


// USER SEAT
router.get('/seatgroups', ensureAuthenticated, function(req, res){
    res.render('user-backend/seatgroups', {title: "Siddegruppe"});
});


// GROUP
var Group = require('../models/seatingGroups');
router.post('/seatgroups', ensureAuthenticated, function(req, res){
    var groupName = req.body.groupName;
    var password = req.body.password;
    var password2 = req.body.password2;
    var members = [req.user.id];
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