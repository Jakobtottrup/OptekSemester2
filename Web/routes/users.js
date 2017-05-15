/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
//const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');

const Group = require('../models/seatingGroups');
const Tournament = require('../models/tournaments');
const Seat = require('../models/seats');
const User = require('../models/user');
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
    res.render('user-backend/userinfo', {title: "Brugerlist"});
});



// USER SEAT
router.get('/getseat', ensureAuthenticated, function(req, res){
    res.render('user-backend/getseat', {title: "Din plads"});
});


// USER SEAT
router.get('/seatgroups', ensureAuthenticated, function(req, res){
    res.render('user-backend/seatgroups', {title: "Siddegrupper"});
});


// SET USER AS ACTIVE FOR CURRENT EVENT
router.post('/joinevent', ensureAuthenticated, function(req, res){
    User.findById(req.user._id, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            if(user.isActive === true && user.hasPaid === false){
                user.isActive = false;
            } else if (user.isActive === false && user.hasPaid === false) {
                user.isActive = true;
            }
            user.save(function (err) {
                if (err) {
                    res.send(err);
                }

                if(user.isActive === true) {
                    req.flash('success_msg', 'Du er nu tilmeldt');

                } else if (user.isActive === false){
                    req.flash('error_msg', 'Du er nu frameldt');
                }
                res.send({redirect: '/dashboard'});
            });
        }
    });
});

// UPDATE USER INFORMATION
router.put('/userupdate/:username/:email/:age/:studie/:fakultet/:steam/:bnet', ensureAuthenticated, function(req, res){
    User.findById(req.user._id, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            user.username = req.params.username;
            user.email = req.params.email;
            user.age = req.params.age;
            user.studie = req.params.studie;
            user.fakultet = req.params.fakultet;

            if (req.params.steam === "|"){
                user.steam = "";
            } else {
                user.steam = req.params.steam;
            }

            if (req.params.bnet === "|"){
                user.bnet = "";
            } else {
                user.bnet = req.params.bnet;
            }

            user.save(function (err) {
                if (err) {
                    res.send(err);
                }
                req.flash('success_msg', 'Dine oplysninger er nu blevet opdateret');
                res.send({redirect: '/dashboard'});
            });
        }
    });
});


// GROUP
router.post('/seatgroups', ensureAuthenticated, function(req, res){
    if (req.user.hasPaid === true) {
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
        if (errors) { // if validation fails
            req.flash("error_msg", "Adgangskoderne skal stemme overens");
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
                } else {
                    Group.createGroup(newGroup, function (err, group) {
                        if (err) throw err;
                    });
                    req.flash('success_msg', 'Gruppen er nu oprettet');
                }
            });
        }
    } else {
        req.flash('error_msg', 'Din betaling er ikke blevet godkendt endnu');
        res.send({redirect: '/users/seatgroups'});
    }
});


groupRoute.put(ensureAuthenticated, function (req, res) {
    if (req.user.hasPaid === true) {
        Group.findById(req.params._id, function (err, group) {
            if (err) {
                res.send(err);
            } else {
                switch (req.params.task) {
                    // add user to group
                    case "0":
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
                                    req.flash('success_msg', 'Du er nu med i gruppen - du kan derfor ikke fuldføre handlingen');
                                    res.send({redirect: '/users/seatgroups'});
                                } else {
                                    console.log("no match")
                                }
                            });
                        } break;

                    // remove user from group
                    case "1":
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
                            req.flash('error_msg', 'Du er nu fjernet fra gruppen');
                            res.send({redirect: '/users/seatgroups'});
                        } break;

                    // edit group details
                    case "2":
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
                            res.send({redirect: '/users/seatgroups'});
                        } break;
                }
            }
        })
    } else {
        req.flash('error_msg', 'Din betaling er ikke blevet godkendt endnu');
        res.send({redirect: '/users/seatgroups'});
    }
});


groupRoute.delete(ensureAuthenticated, function (req, res) {
    if (req.user.hasPaid === true) {
        Group.findOne({_id: req.params._id}, function (err, group) {
            if(group.leaderID === req.user.id || req.user.isAdmin === true) {
                Group.findByIdAndRemove(req.params._id, function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                req.flash('error_msg', 'Gruppen er nu slettet');
                res.send({redirect: '/users/seatgroups'});

            } else if (group.leaderID !== req.user.id) {
                req.flash('error_msg', 'Du har ikke rettigheder til at slette denne gruppe!');
                res.send({redirect: '/users/seatgroups'});
            }
        });
    } else {
        req.flash('error_msg', 'Din betaling er ikke blevet godkendt endnu');
        res.send({redirect: '/users/seatgroups'});
    }
});



    /** ********************** **/
    /** TOURNAMENT CONTROLLERS **/
    /** ********************** **/

// REDNER USER TOURNAMENTS
router.get('/tournaments', ensureAuthenticated, function(req, res){
    res.render('user-backend/tournaments', {title: "Turneringer"});
});


router.put("/leavetournament", function(req, res){
    let tourID = req.body.tourID;
    Tournament.findById(tourID, function (err, tournament) {
        for(let i = 0; i < tournament.teams.length;i++){
            if(tournament.teams[i].leaderID === req.user.id){
                tournament.teams.splice(i, 1);
                tournament.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                });
                req.flash('error_msg', 'Dit hold er nu afmeldt turneringen');
            } else {
                req.flash('error_msg', 'Du har ikke den  nødvendige rettighed til denne handling');
            }
        }
    });
    res.send({redirect: '/users/tournaments'});
});


router.put("/jointournamentteam", function(req, res){

});


router.put("/createtournamentteam", function(req, res){
    if (req.user.hasPaid === true){
        const tourID = req.body.tourID;
        const t_name = req.body.t_name;
        let t_pass = req.body.t_pass;
        const t_pass2 = req.body.t_pass2;

        // validate
        req.checkBody('t_name', 'Holdnavn er nødvendigt').notEmpty();
        req.checkBody('t_pass', 'Kodeord er nødvendigt').notEmpty();
        req.checkBody('t_pass2', 'Tjek venligst at kodeordene stemmer overens').equals(t_pass);
        let errors = req.validationErrors();
        if (errors) {
            req.flash("error_msg", errors[0].msg);

            // if validation succeeds
        } else {
            Tournament.findOne({_id: tourID}, function (err, tournament) {
                if (err) {
                    res.send(err);
                }

                let leaderID = req.user.id;
                let members = [];
                let createdAt = new Date();

                // encrypt password and save team to tournament document
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(t_pass, salt, function(err, hash) {
                        t_pass = hash;
                        team = {t_name, t_pass, members, createdAt, leaderID};
                        tournament.teams.push(team);
                        tournament.save(function (err) {
                            if (err) {
                                res.send(err);
                            }
                            req.flash('success_msg', 'Holdet er nu oprettet');
                        });
                    });
                });
            });
        }
        // if user have hasPaid = false
    } else {
        req.flash('error_msg', 'Du kan først udføre denne handling, når din betaling er godkendt');
    }
    res.send({redirect: '/users/tournaments'});
});



    /** **************** **/
    /** SEAT CONTROLLERS **/
    /** **************** **/

seatRoute.put(ensureAuthenticated, function (req, res) {
    console.log("SEAT INDEX: " + req.params.index);
    Seat.find({}, function (err, seats) {
        seats = seats[0].container;
        seats = JSON.parse(seats);

        console.log(seats);
    });
});


module.exports = router;