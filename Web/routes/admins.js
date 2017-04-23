/**
 * Created by chris on 11-04-2017.
 */


//// USED TO DISPLAY ADMIN BACKEND PANEL ////


const express = require('express');
const router = express.Router();

// ADMIN AUTHENTICATION
function ensureAdminAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.isAdmin === true){
            return next();
        } else if (req.user.isAdmin === false){
            req.flash('error_msg','Du har ikke de nødvendige rettigheder');
            res.redirect('/dashboard');
        }
    } else {
        req.flash('error_msg','Du er ikke logget ind');
        res.redirect('/login');
    }
}


// RENDER CREATE SEATS VIEW
router.get('/create_seats', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/create_seats', {title: "Bordopstilling"});
});


// RENDER POSTS VIEW
router.get('/posts', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/posts', {title: "Opslag"});
});


// RENDER SEATING GROUP VIEW
router.get('/seating_groups', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/seating_groups', {title: "Siddegrupper"});
});


// RENDER TOURNAMENT VIEW
router.get('/tournaments', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/tournaments', {title: "Turneringer"});
});


// RENDER USERS VIEW
router.get('/users', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/users', {title: "Brugere"});
});


// RENDER POSTS VIEW
router.get('/sponsors', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/sponsors', {title: "Sponsorer"});
});


// REGISTER SEAT
var seats = require('../models/seats');
router.post('/create_seats', ensureAdminAuthenticated, function(req, res){
    var seatName = req.body.seatName;

    // VALIDATION
    req.checkBody('seatName', 'Pladsnavn er nødvendigt').notEmpty();

    var errors = req.validationErrors();
    if(errors){ // if validation fails
        res.render('frontend/index',{
            errors:errors
        });
        console.log(errors);
    } else { //if validation succeeds server sends data to database using modelschema "users.js"
        var newSeat = new seats({
            seatName: seatName,
            seatState: 0,
            seatOpen: false,
            seatUserID: 0,
            seatGroupID: 0
        });

        newSeat.save(function(err) {
            if (err) throw err;

            console.log("Seat created!");
        });
        res.redirect('/admins/create_seats');
    }
});

// RENDER EVENT VIEW
router.get('/events', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/events', {title: "Admin Panel"});
});

// RENDER MAILS VIEW
router.get('/mails', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/mails', {title: "Admin Panel", name: "Brugers navn"});
});


module.exports = router;
