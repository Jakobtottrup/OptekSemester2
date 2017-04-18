/**
 * Created by chris on 11-04-2017.
 */


//// USED TO DISPLAY ADMIN BACKEND PANEL ////


var express = require('express');
var router = express.Router();


// RENDER REGISTER VIEW
router.get('/adminpanel', function(req, res){
    res.render('admin-backend/admindashboard', {title: "Admin Panel"});
});


// RENDER REGISTER VIEW
router.get('/create_seats', function(req, res){
    res.render('admin-backend/create_seats', {title: "Create Seats"});
});

/*
// REGISTER GROUP
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
            seatOpen: 0,
            seatUserID: 0,
            seatGroupID: 0
        });

        seats.createGroup(newSeat, function(err, group){
            if(err) throw err;
            //console.log(group);
        });
        req.flash('success_msg', 'Pladsen er nu oprettet');
        res.redirect('/admins/create_seats');
    }
});

*/
module.exports = router;
