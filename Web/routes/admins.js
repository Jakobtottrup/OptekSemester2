/**
 * Created by chris on 11-04-2017.
 */


//// USED TO DISPLAY ADMIN BACKEND PANEL ////

const mongo = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;


const express = require('express');
const multer = require('multer');
var upload = multer({ dest: '/public'});
const router = express.Router();


const seats = require('../models/seats');
const User = require('../models/user');
const Tournament = require('../models/tournaments');
var userRoute = router.route('/users/:_id/:adminClicked/:paymentClicked');
var delRoute = router.route('/users/:_id');
var delTourRoute = router.route('/tournaments/:_id');
var mailRoute = router.route('/mails');


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
var tourUploads = multer({ dest: 'public/uploads/image/tournaments' });
var tourPrizeUploads = multer({ dest: 'public/uploads/image/tournaments/prizes' });
router.post('/tournaments', /*tourUploads.single('upload-pic'),*/ tourPrizeUploads.array("prize_name"), ensureAdminAuthenticated, function (req, res) {
    console.log(req.file);

    const name = req.body.tour_name;
    const description = req.body.tour_info;
    const openingDate = req.body.opening_date;
    const closingDate = req.body.closing_date;
    const startDate = req.body.start_date;
    const tourDuration = req.body.tour_duration;
    const isVisibel = req.body.visibility;
    const maxTeams = req.body.team_size;
    const maxTeamSize = req.body.team_maxsize;
    const minTeamSize = req.body.team_minsize;
    const image = req.file.path;

    var prizes = [];

    if (typeof req.body.prize_name !== "undefined"){
        const prize_name = req.body.prize_name;
        const prize_info = req.body.prize_info;
        const prize_image = req.body.prize_image;

        // prize_name will appear as a sting, if only one prize is posted
        if (typeof prize_name === "string") {
            var p_index = 0;
            var p_name = prize_name;
            var p_description = prize_info;
            prizes.push({p_index, p_name, p_description});
        // if prize_name is an array
        } else {
            if (prize_name.length === prize_info.length /*=== req.body.prize_image.length*/) {
                for (i = 0; i < prize_name.length; i++) {
                    var p_index = i;
                    var p_name = prize_name[i];
                    var p_description = prize_info[i];
                    var p_image = /*prize_image[i];*/ "http://duckboss.com/wp-content/uploads/2016/02/cats1.png"; //TODO: Skal lige ændres
                    prizes.push({p_index, p_name, p_description, p_image});
                }
            }
        }
    }

    // validation
    // req.checkBody('name', 'Name required').notEmpty();
    // req.checkBody('openingDate', 'Åbningsdato for tilmelding er nødvendig').notEmpty();
    // req.checkBody('closigDate', 'Lukkedato for tilmelding er nødvendig').notEmpty();
    // req.checkBody('startDate', 'Start dato er nødvendig').notEmpty();
    // req.checkBody('minTeamSize', 'Holdbegrænsning er nødvendigt').notEmpty();
    // req.checkBody('maxTeamSize', 'Maximum kan ikke være mindre end minimum').notEmpty(); //TODO: Skal samlignes med minTeamSize, for at undgå negativt tal

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin-backend/tournaments', {errors: errors});
        console.log(errors);
    } else {
        var newTournament = new Tournament({
            name: name,
            description: description,
            openingDate: openingDate,
            closingDate: closingDate,
            startDate: startDate,
            isVisibel: isVisibel,
            maxTeams: maxTeams,
            maxTeamSize: maxTeamSize,
            minTeamSize: minTeamSize,
            tourDuration: tourDuration,
            prizes: prizes

        });

        newTournament.save(function (err) {
            if (err) throw err;
            req.flash('success_msg', 'Turneringen er nu oprettet');
            res.redirect('/admins/tournaments');
        });
    }
});

router.delete('/tournaments/:_id', ensureAdminAuthenticated, function (req, res) {
    console.log("deleted tournament");
    console.log(req.body);
});

delTourRoute.delete(ensureAdminAuthenticated, function (req, res) {
    console.log("deleting tournamnet");
    Tournament.findByIdAndRemove(req.params._id, function (err) {
        if (err)
            res.send(err);
        res.json({message: 'Tournamnet removed from the DB!'});
    });
});
mailRoute.post(function (req, res, next) {


    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sdulan.optek@gmail.com', // Your email id
            pass: 'OpTek2016' // Your password
        }
    });

    var text = 'HEJ CHRISTIAN from \n\n' + req.body.name + "\n\nDU ER DÅM";

    var mailOptions = {
        from: 'sdulan.optek@gmail.com', // sender address
        to: 'cskje16@student.sdu.dk', // list of receivers
        subject: 'Email Test Example', // Subject line
        text: text, //, // plaintext body
        html: '<b>Hello world </b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({yo: 'error'});
        } else {
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        }
        ;
    });
    /*app.mailer.send('email', {
     to: 'christianskjerning@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
     subject: 'Test Email', // REQUIRED.
     otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
     }, function (err) {
     if (err) {
     // handle error
     console.log(err);
     res.send('There was an error sending the email');
     return;
     }
     res.send('Email Sent');
     });*/
});


module.exports = router;
