/**
 * Created by chris on 11-04-2017.
 */


//// USED TO DISPLAY ADMIN BACKEND PANEL ////


var express = require('express');
var router = express.Router();


// RENDER REGISTER VIEW
router.get('/adminpanel', function(req, res){
    res.render('admin-backend/adminsDashboard', {title: "Admin Panel", name: "Brugers navn"}); //TODO: skal ændres til req.user.name (eller noget der henter brugerens navn
});


// RENDER REGISTER VIEW
router.get('/create_seats', function(req, res){
    res.render('admin-backend/create_seats', {title: "Create Seats"});
});


// REGISTER SEAT
var seats = require('../models/seats');
router.post('/create_seats', function(req, res){
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
router.get('/events', function(req, res){
    res.render('admin-backend/events', {title: "Admin Panel"});
});

// RENDER MAILS VIEW
router.get('/mails', function(req, res){
    res.render('admin-backend/mails', {title: "Admin Panel", name: "Brugers navn"});
});




module.exports = router;
