/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
//const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Group = require('../models/seatingGroups');
const Tournament = require('../models/tournaments');
const Seat = require('../models/seats');
const groupRoute = router.route('/seatgroups/:_id/:task/:pass');
const tourRoute = router.route('/tournaments/:_id/:task/:tn/:tp/:tp2');
const seatRoute = router.route('/getseat/:index');


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

// CREATE TEAM
router.get('/createteam', ensureAuthenticated, function(req, res){
    res.render('user-backend/create_team', {title: "Opret turneringshold"});
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
    let groupName = req.body.group_name;
    let password = req.body.password;
    let password2 = req.body.password2;
    let members = [];
    let leaderID = req.user.id;

    // VALIDATION
    req.checkBody('group_name', 'Gruppenavn er nødvendigt').notEmpty();
    req.checkBody('password', 'Kodeord er nødvendigt').notEmpty();
    req.checkBody('password2', 'Tjek venligst at kodeordene stemmer overens').equals(req.body.password);

    let errors = req.validationErrors();
    if(errors){ // if validation fails
        req.flash("error_msg", "Adgangskoderne skal stemme overens");
        res.redirect("/users/seatgroups");
        console.log(errors);
    } else {
        let newGroup = new Group({
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
    // console.log("ID: "+req.params._id);
    // console.log("Task: "+req.params.task);
    // console.log("Pass: "+req.params.pass);

    switch (req.params.task) {
        // add user to group
        case "0": Group.findById(req.params._id, function (err, group) {
            if (err) {
                res.send(err);
            } else {
                Group.comparePassword(req.params.pass, group.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
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
                let index = group.members.indexOf(req.user.id);
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



tourRoute.put(ensureAuthenticated, function (req, res) {
    var t_name = req.params.tn;
    var t_pass = req.params.tp;
    var t_pass2 = req.params.tp2;
    var t_leaderID = req.user.id;
    var t_members = [];
    console.log(t_name, t_pass, t_pass2, t_leaderID, t_members);

    req.checkBody('t_name', 'Holdnavn er påkrævet').notEmpty();
    req.checkBody('t_pass', 'Kodeord er nødvendigt').notEmpty();
    req.checkBody('t_pass2', 'Tjek venligst at kodeordene stemmer overens').equals(req.params.tp2);
    var errors = req.validationErrors();


    switch (req.params.task) {
        // add user to group
        case "0": Tournament.findById(req.params._id, function (err, tournament, req) {
            if (err) {
                res.send(err);
            } else {
                if(errors){ // if validation fails
                    console.log(errors);
                    req.flash("error_msg", "Adgangskoderne skal stemme overens");
                    res.redirect("/users/tournaments");
                } else {

                    console.log("no errors!");

                    // tournament.teams.push({t_name, t_members, t_pass, t_leaderID});

                    /*
                    // save changes to database
                    tournament.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                    });
                    */
                }
                req.flash('success_msg', 'Du er nu med i gruppen');
                res.status(200).render('user-backend/seatgroups');
            }
        }); break;
        case "1": Tournament.findById(req.params._id, function (err, tournament) {
            if (err) {
                res.send(err);
            } else {
                // push user ID in to members array
                tournament.teams.push(req.user.id);
                // save changes to database
                tournament.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                req.flash('success_msg', 'Du er nu med i gruppen');
                res.status(200).render('user-backend/seatgroups');
            }
        }); break;
    }
});

seatRoute.put(ensureAuthenticated, function (req, res) {
    console.log("SEAT INDEX: " + req.params.index);
    Seat.find({}, function (err, seats) {
        seats = seats[0].container;
        seats = JSON.parse(seats);

        console.log(seats);
    });
});

module.exports = router;