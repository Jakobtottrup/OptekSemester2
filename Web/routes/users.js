/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
//var LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Group = require('../models/seatingGroups');
const groupRoute = router.route('/seatgroups/:_id');

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
router.get('/tournaments', ensureAuthenticated, function(req, res){
    res.render('user-backend/usertournaments', {title: "Dine Turneringer"});
});


// USER SEAT
router.get('/getseat', ensureAuthenticated, function(req, res){
    res.render('user-backend/getseat', {title: "Din plads"});
});


// USER SEAT
router.get('/seatgroups', ensureAuthenticated, function(req, res){
    res.render('user-backend/seatgroups', {title: "Siddegrupper"});
});


// GROUP
router.post('/seatgroups', ensureAuthenticated, function(req, res){
    var groupName = req.body.group_name;
    var password = req.body.password;
    var password2 = req.body.password2;
    var members = [];
    var leaderID = req.user.id;


    // VALIDATION
    req.checkBody('group_name', 'Gruppenavn er nødvendigt').notEmpty();
    req.checkBody('password', 'Kodeord er nødvendigt').notEmpty();
    req.checkBody('password2', 'Tjek venligst at kodeordene stemmer overens').equals(req.body.password);


    var errors = req.validationErrors();
    if(errors){ // if validation fails
        res.render('frontend/index',{
            errors:errors
        });
        console.log(errors);
    } else {
        var newGroup = new Group({
            groupName: groupName,
            password: password,
            members: members,
            leaderID: leaderID
        });

        Group.findOne({groupName: groupName}, function (err, group) {
            if (err)
                return done(err);

            if (group) {
                req.flash('error_msg', 'Gruppenavn eksisterer allerede');
                res.redirect('/users/seatgroups');
            } else {
                Group.createGroup(newGroup, function (err, group) {
                    if (err) throw err;
                });
                req.flash('success_msg', 'Gruppen er nu oprettet');
                res.redirect('/users/seatgroups');
            }
        });
    }
});

router.put("/seatgroups", ensureAuthenticated, function(req, res){

});

groupRoute.put(ensureAuthenticated, function (req, res) {
    Group.findByIdAndUpdate(req.params._id, req.body.members, function (err, group) {
        if (err) {
            res.send(err);
        }
        else {
            // console.log("active user ID: "+req.user.id);
            // console.log("Param ID: "+req.params._id);
            // console.log("found group: "+group);
            // console.log("group members before push: "+group.members);
            group.members.push(req.user.id);
            // console.log("group members after push: "+group.members);
            group.save(function (err) {
                if (err) {
                    res.send(err);
                }
            });
            req.flash('success_msg', 'Du er nu med i gruppen');
            res.redirect('/users/seatgroups');
            // res.status(204).end();
        }
    });
});

module.exports = router;