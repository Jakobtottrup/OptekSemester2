/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
//var LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Group = require('../models/seatingGroups');
const Tournament = require('../models/tournaments');
const groupRoute = router.route('/seatgroups/:_id/:task/:pass');
const tourRoute = router.route('/tournaments/:_id');


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
    res.render('user-backend/tournaments', {title: "Dine Turneringer"});
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
        req.flash("error_msg", "Adgangskoderne skal stemme overens");
        res.redirect("/users/seatgroups");
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



groupRoute.put(ensureAuthenticated, function (req, res) {
    console.log("ID: "+req.params._id);
    console.log("Task: "+req.params.task);
    console.log("Pass: "+req.params.pass);

    switch (req.params.task) {
        // add user to group
        case "0": Group.findById(req.params._id, function (err, group) {
            if (err) {
                res.send(err);
            } else {
                Group.comparePassword(req.params.pass, group.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        console.log("password match");
                        // push user ID in to members array
                        group.members.push(req.user.id);
                        // save changes to database
                        group.save(function (err) {
                            if (err) {
                                res.send(err);
                            }
                        });
                        req.flash('success_msg', 'Du er nu med i gruppen');
                        res.status(200).render('user-backend/seatgroups');
                    } else {
                       console.log("no match")
                    }
                });
            }
        }); break;

        // remove user from group
        case "1": Group.findById(req.params._id, function (err, group) {
            if (err) {
                res.send(err);
            } else {
                // search for user ID in array and then remove matches.
                var index = group.members.indexOf(req.user.id);
                if (index >= 0) {
                    group.members.splice(index, 1);
                }
                // save changes to database
                group.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                req.flash('success_msg', 'Du er nu fjernet fra gruppen');
                res.status(200).render('user-backend/seatgroups');
            }
        }); break;

        // edit group details
        case "2": Group.findById(req.params._id, function (err, group) {
            if (err) {
                res.send(err);
            } else {

                // save changes to database
                group.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                req.flash('success_msg', 'Ændringerne er blevet gemt');
                res.status(200).render('user-backend/seatgroups');
            }
        }); break;
    }
});


groupRoute.delete(ensureAuthenticated, function (req, res) {
    Group.findOne({_id: req.params._id}, function (err, group) {
        if(group.leaderID === req.user.id || req.user.isAdmin === true) {
            Group.findByIdAndRemove(req.params._id, function (err) {
                if (err) {
                    res.send(err);
                }
            });
            req.flash('success_msg', 'Gruppen er nu slettet');
            res.status(200).redirect("/users/seatgroups");

        } else if (group.leaderID !== req.user.id) {
            req.flash('error_msg', 'Du har ikke rettigheder til at slette denne gruppe!');
            res.status(406).redirect("/users/seatgroups");
        }
    });
});


// not finished
tourRoute.post(ensureAuthenticated, function (req, res) {
    Tournament.findByIdAndUpdate(req.params._id, function (err, group) {
        if (err) {
            res.send(err);
        } else {
            // push user ID in to members array
            group.members.push(req.user.id);
            // save changes to database
            group.save(function (err) {
                if (err) {
                    res.send(err);
                }
            });
            req.flash('success_msg', 'Du er nu med i gruppen');
            res.status(200).render('user-backend/seatgroups');
        }
    });
});


module.exports = router;