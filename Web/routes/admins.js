/**
 * Created by chris on 11-04-2017.
 */


//// USED TO DISPLAY ADMIN BACKEND PANEL ////

const mongo = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;


const express = require('express');
const router = express.Router();

const seats = require('../models/seats');
const User = require('../models/user');
var userRoute = router.route('/users/:_id/:adminClicked/:paymentClicked');
var delRoute = router.route('/users/:_id');


// ADMIN AUTHENTICATION
function ensureAdminAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin === true) {
            return next();
        } else if (req.user.isAdmin === false) {
            req.flash('error_msg', 'Du har ikke de nødvendige rettigheder');
            res.redirect('/dashboard');
        }
    } else {
        req.flash('error_msg', 'Du er ikke logget ind');
        res.redirect('/login');
    }
}


// RENDER CREATE SEATS VIEW
router.get('/create_seats', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/create_seats', {title: "Bordopstilling"});
});


// RENDER POSTS VIEW
router.get('/posts', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/posts', {title: "Opslag"});
});


// RENDER SEATING GROUP VIEW
router.get('/seating_groups', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/seating_groups', {title: "Siddegrupper"});
});


// RENDER TOURNAMENT VIEW
router.get('/tournaments', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/tournaments', {title: "Turneringer"});
});


// RENDER USERS VIEW
router.get('/users', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/users', {title: "Brugere"});
});


// RENDER POSTS VIEW
router.get('/sponsors', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/sponsors', {title: "Sponsorer"});
});

// RENDER EVENT VIEW
router.get('/events', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/events', {title: "Admin Panel"});
});

// RENDER MAILS VIEW
router.get('/mails', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/mails', {title: "Admin Panel", name: "Brugers navn"});
});

router.post('/create_seats', ensureAdminAuthenticated, function (req, res) {
    var seatName = req.body.seatName;

    // VALIDATION
    req.checkBody('seatName', 'Pladsnavn er nødvendigt').notEmpty();

    var errors = req.validationErrors();
    if (errors) { // if validation fails
        res.render('frontend/index', {
            errors: errors
        });
        console.log(errors);
    } else { //if validation succeeds server sends data to database using modelschema "users.js"

        var newSeat = new seats({
            container: seatName
        });

        seats.remove({}, function (err) {
                if (err) {
                    console.log(err);
                } else {

                    newSeat.save(function (err) {
                        if (err) throw err;

                        console.log("Room created!");
                    });

                    res.end('success');
                }
            }
        );

        res.redirect('/admins/create_seats');

    }
});


// RENDER EVENT VIEW
router.get('/events', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/events', {title: "Admin Panel"});
});

// RENDER MAILS VIEW
router.get('/mails', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/mails', {title: "Admin Panel", name: "Brugers navn"});
});

router.delete('/users/:_id', ensureAdminAuthenticated, function (req, res) {
    console.log("deleted");
    console.log(req.body);

    //res.redirect('/users');
});
userRoute.get(function (req, res) {
    User.findById(req.params._id, function (err, user) {
        if (err)
            res.send(err);

        res.json(user);
    });
});


userRoute.put(ensureAdminAuthenticated, function (req, res) {
    User.findByIdAndUpdate(req.params._id, req.params.adminClicked, req.params.paymentClicked, function (err, user) {
        if (err)
            res.send(err);
        if (req.params.paymentClicked !== "true") {
            user.isAdmin = !user.isAdmin;
        }
        if (req.params.paymentClicked === "true") {
            user.hasPaid = !user.hasPaid;
        }
        user.save(function (err) {
            if (err)
                res.send(err);
            res.json(user);
        });
    });
});

delRoute.delete(ensureAdminAuthenticated, function (req, res) {
    console.log("deleting user");
    User.findByIdAndRemove(req.params._id, function (err) {
        if (err)
            res.send(err);
        res.json({message: 'User removed from the DB!'});
    });
});


// CREATE TOURNAMENT
router.post('/tournaments', function (req, res) {
    var name = req.body.tour_name;
    var description = req.body.tour_info;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var endDate = req.body.endDate;

    console.log("start: " + startDate);
    console.log("end: " + endDate);

    /*
     //validation
     req.checkBody('username', 'Name required').notEmpty();
     req.checkBody('age', 'Age required').notEmpty();
     req.checkBody('email', 'Email required').notEmpty();
     req.checkBody('email', 'Invalid email format').isEmail();
     req.checkBody('password', 'Password required').notEmpty();
     req.checkBody('studie', 'Studie required').notEmpty();
     req.checkBody('fakultet', 'Fakultet required').notEmpty();
     req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


     var errors = req.validationErrors();

     if (errors) {
     res.render('frontend/signup', {errors: errors});
     } else {
     var newTournament = new User({
     username: username,
     age: age,
     email: email,
     password: password,
     studie: studie,
     fakultet: fakultet,
     bnet: bnet,
     steam: steam,
     isAdmin: false
     });
     }*/
    res.redirect("/admins/tournaments");
});


module.exports = router;
