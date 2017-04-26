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
var userRoute = router.route('/users/:_id');






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

// RENDER EVENT VIEW
router.get('/events', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/events', {title: "Admin Panel"});
});

// RENDER MAILS VIEW
router.get('/mails', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/mails', {title: "Admin Panel", name: "Brugers navn"});
});



/*

// REGISTER SEAT
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
            test: seatName
            /*
            seatName: seatName,
            seatState: 0,
            seatOpen: false,
            seatUserID: 0,
            seatGroupID: 0*//*
        });


*/


/*

        // get a user with ID of 1
        User.findById(1, function(err, user) {
            if (err) throw err;

            // change the users location
            seats = 'uk';

            // save the user
            user.save(function(err) {
                if (err) throw err;

                console.log('User successfully updated!');
            });

        });
*/
/*



        // find the user starlord55
        // update him to starlord 88
        seats.findOneAndUpdate({test: 'asdfgjkljhgfdsaSDFKJLJHGFDSA'}, { test: 'abcba' }, function(err, user) {
            if (err) throw err;

            // we have the updated user returned to us
            console.log(user);
        });


*/
/*
        console.log(seats.find({test: 'ddeeff'}));

        newSeat.save(function(err) {
            if (err) throw err;

            console.log("Seat created!");
        });
        res.redirect('/admins/create_seats');


    }
});

*/



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
            container: seatName
        });

        seats.remove({}, function(err) {
                if (err) {
                    console.log(err);
                } else {

                    newSeat.save(function(err) {
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





/*

router.put('/create_seats/:id', function(req, res){
    var id = req.params.id;
console.log("HEEEEEY YO CONSOLE LOG");
    seats.findOne({_id: id}, function(err, foundObject) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (!foundObject) {
                res.status(404).send();
            } else {
                if (req.body.name) {
                    foundObject.name = req.body.name;
                }

                if (req.body.icecreamname) {
                    foundObject.icecreamname = req.body.icecreamname;
                }

                foundObject.save(function(err, updatedObject) {
                    if (err) {
                        console.log(err);
                        res.status(500).send();
                    } else {
                        res.send(updatedObject);
                    }
                });
            }
        }
    });

});
*/




// RENDER EVENT VIEW
router.get('/events', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/events', {title: "Admin Panel"});
});

// RENDER MAILS VIEW
router.get('/mails', ensureAdminAuthenticated, function(req, res){
    res.render('admin-backend/mails', {title: "Admin Panel", name: "Brugers navn"});
});

router.delete('/users', ensureAdminAuthenticated, function (req, res) {
    console.log("deleted");
    console.log(req.body);

    //res.redirect('/users');
});
userRoute.get(function(req, res) {
    User.findById(req.params._id, function(err, user) {
        if (err)
            res.send(err);

        res.json(user);
    });
});

userRoute.delete(function(req, res) {
    console.log("deleting user");
    User.findByIdAndRemove(req.params._id, function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'User removed from the DB!' });
    });
});
module.exports = router;
