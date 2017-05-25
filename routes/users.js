/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
//const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');
const async = require('async');

const Group = require('../models/seatingGroups');
const Tournament = require('../models/tournaments');
const Seat = require('../models/seats');
const User = require('../models/user');
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

// USER INFO
router.get('/payment', ensureAuthenticated, function(req, res){
    res.render('user-backend/paymentguide', {title: "Betalingsguide"});
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
router.put('/userupdate', ensureAuthenticated, function(req, res){
    User.findById(req.user._id, function (err, user) {
        if (err) {
            res.send(err);
        } else {
            user.email = req.body.email;
            user.age = req.body.age;
            user.studie = req.body.studie;
            user.fakultet = req.body.fakultet;
            user.steam = req.body.steam;
            user.bnet = req.body.bnet;
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


/** ********************** **/
/** SEAT GROUP CONTROLLERS **/
/** ********************** **/

function redirectSeatGroups(req, res){
    if (req.user.isAdmin === true){
        res.send({redirect: '/admins/seating_groups'});
    } else {
        res.send({redirect: '/users/seatgroups'});
    }
}

// RENDER VIEW
router.get('/seatgroups', ensureAuthenticated, function(req, res){
    res.render('user-backend/seatgroups', {title: "Siddegrupper"});
});

// CREATE GROUP
router.put('/createseatgroup', ensureAuthenticated, function(req, res){
    console.log("first ",req.body);
    let group_name = req.body.group_name;
    let password = req.body.password;
    let password2 = req.body.password2;
    let members = [];
    let leader_id = req.user.id;

    // VALIDATION
    req.checkBody('group_name', 'Gruppenavn er nødvendigt').notEmpty();
    req.checkBody('password', 'Kodeord er nødvendigt').notEmpty();
    req.checkBody('password2', 'Tjek venligst at kodeordene stemmer overens').equals(password);
    let errors = req.validationErrors();
    if (errors) {
        req.flash("error_msg", errors[0].msg);
        redirectSeatGroups(req, res);
    } else {
        if (req.user.hasPaid === true || req.user.isAdmin === true) {
            async.waterfall([
                function(done){
                    Group.findOne({group_name: group_name}, function (err, group) {
                        if (err) throw err;
                        console.log("group",group);
                        if (group === null) {
                            let newGroup = new Group({
                                group_name: group_name,
                                password: password,
                                members: members,
                                leader_id: leader_id
                            });
                            Group.createGroup(newGroup, function (err, group) {
                                if (err) throw err;
                                req.flash('success_msg', 'Gruppen er nu oprettet');
                                redirectSeatGroups(req, res);
                            });
                        } else {
                            req.flash('error_msg', 'Gruppenavn eksisterer allerede');
                            redirectSeatGroups(req, res);
                        }
                    });
                },
            ], function (err) {
                console.log("waterfall done")

            });
        } else {
            console.log("fifth ",req.body);
            req.flash('error_msg', 'Du kan ikke fuldføre handlingen, da din betaling er ikke blevet godkendt endnu');
            redirectSeatGroups(req, res);

        }
    }
});


// DELETE GROUP
router.delete('/deleteseatgroup', ensureAuthenticated, function(req, res){
    if (req.user.hasPaid === true || req.user.isAdmin === true) {
        let group_id = req.body.group_id;
        let leader_id = req.user.id;
        Group.findByIdAndRemove({_id: group_id, leader_id: leader_id}, function (err, group) {
            if (err) throw err;
            if (group === null) {
                req.flash('error_msg', 'Gruppen blev ikke fundet');
                redirectSeatGroups(req, res);
            } else {
                req.flash('error_msg', 'Gruppen er nu slettet');
                redirectSeatGroups(req, res);
            }
        });
    } else {
        req.flash('error_msg', 'Din betaling er ikke blevet godkendt endnu');
        redirectSeatGroups(req, res);
    }
});


// JOIN GROUPS
router.put('/joinseatgroup', ensureAuthenticated, function(req, res){
    if (req.user.hasPaid === true || req.user.isAdmin === true) {
        let group_id = req.body.group_id;
        let user_id = req.user.id;
        let password = req.body.password;
        Group.findById(group_id, function (err, group) {
            if (group !== null) {
                if (group.password === password){
                    group.members.push(user_id);
                    group.save(function (err) {
                        if (err) {
                            res.send(err);
                        }
                        req.flash('success_msg', 'Du er nu med i gruppen');
                        redirectSeatGroups(req, res);
                    });

                } else {
                    req.flash('error_msg', 'Forkert kodeord');
                    redirectSeatGroups(req, res);
                }
            } else {
                console.log("group",group);
                req.flash('error_msg', 'Gruppen blev ikke fundet');
                redirectSeatGroups(req, res);
            }
        });
    } else {
        req.flash('error_msg', 'Du kan ikke fuldføre handlingen, da din betaling er ikke blevet godkendt endnu');
        redirectSeatGroups(req, res);
    }
});


// LEAVE GROUPS
router.put('/leaveseatgroup', ensureAuthenticated, function(req, res){
    if (req.user.hasPaid === true || req.user.isAdmin === true) {
        let group_id = req.body.group_id;
        let user_id = req.user.id;

        Group.findById(group_id, function (err, group) {
            if (err) throw err;
            console.log("group",group);

            let index = group.members.indexOf(user_id);
            if (index > -1) {
                group.members.splice(index, 1);
            }
            console.log("index", index);
            group.save(function (err) {
                if (err) {
                    res.send(err);
                }
                req.flash('success_msg', 'Du er nu fjernet fra gruppen');
            });
            redirectSeatGroups(req, res);
        });
    } else {
        req.flash('error_msg', 'Du kan ikke fuldføre handlingen, da din betaling er ikke blevet godkendt endnu');
        redirectSeatGroups(req, res);
    }
});


// UPDATE GROUPS
router.put('/updateseatgroup', ensureAuthenticated, function(req, res){
    console.log(req.body);
/*
    if (req.user.hasPaid === true || req.user.isAdmin === true) {
        let group_id = req.body.group_id;
        let user_id = req.user.id;
        let members = req.user.members;
        let group_name = req.user.members;

        Group.findById(group_id, function (err, group) {
            if (err) throw err;
            if(group.leader_id === user_id){
                group.members = members;
                group.group_name = group_name;
                group.updated_at = Date.now;
                req.flash('success_msg', 'Ændringerne er blevet gemt');
            } else {
                req.flash('error_msg', 'Du har ikke de nødvendige rettigheder');
            }
        });
    } else {
        req.flash('error_msg', 'Du kan ikke fuldføre handlingen, da din betaling er ikke blevet godkendt endnu');
    }*/
    redirectSeatGroups(req, res);
});





    /** ********************** **/
    /** TOURNAMENT CONTROLLERS **/
    /** ********************** **/

// RENDER USER TOURNAMENTS
router.get('/tournaments', ensureAuthenticated, function(req, res){
    res.render('user-backend/tournaments', {title: "Turneringer"});
});


router.put("/leavetournament", ensureAuthenticated, function(req, res){
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
                req.flash('error_msg', 'Du har ikke de nødvendige rettigheder til denne handling');
            }
        }
    });
    res.send({redirect: '/users/tournaments'});
});

router.put("/jointournamentteam", ensureAuthenticated, function(req, res){

});


router.put("/createtournamentteam", ensureAuthenticated, function(req, res){
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

                if(tournament.maxTeams > tournament.teams.length) {
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
                } else {
                    req.flash('error_msg', 'Der kan ikke tilmeldes flere hold til denne turnering');
                }
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

// RENDER VIEW
router.get('/getseat', ensureAuthenticated, function(req, res){
    res.render('user-backend/getseat', {title: "Din plads"});
});

seatRoute.put(ensureAuthenticated, function (req, res) {
    console.log("SEAT INDEX: " + req.params.index);
    Seat.find({}, function (err, seats) {
        seats = seats[0].container;
        seats = JSON.parse(seats);
    });
});


module.exports = router;