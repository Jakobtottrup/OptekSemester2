/**
 * Created by chris on 11-04-2017.
 */


//// USED TO DISPLAY ADMIN BACKEND PANEL ////

// DECLARING MODULES
const mongo = require('mongodb');
const mongoose = require('mongoose');
const db = mongoose.connection;
const nodemailer = require('nodemailer');
const express = require('express');
const multer = require('multer');
const async = require('async');
const fs = require('fs');

// DECLARING MODELS AND ROUTES
const seats = require('../models/seats');
const User = require('../models/user');
const Tournament = require('../models/tournaments');
const router = express.Router();
var userRoute = router.route('/users/:_id/:adminClicked/:paymentClicked');
var delRoute = router.route('/users/:_id');
const TourRoute = router.route('/tournaments/:_id');
var mailRoute = router.route('/mails');
var groupRoute = router.route('/seatgroups/:_id');

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

// RENDER GALLERY UPLOAD VIEW
router.get('/gallery',ensureAdminAuthenticated, function(req,res){
   res.render('admin-backend/gallery',{title:'Admin panel'});
});

// RENDER EVENT VIEW
router.get('/events', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/events', {title: "Admin Panel"});
});

// RENDER MAILS VIEW
router.get('/mails', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/mails', {title: "Admin Panel", name: "Brugers navn"});
});

//Upload files
var uploads = multer({ dest: 'public/uploads/image/gallery'});
router.post('/gallery',ensureAdminAuthenticated, uploads.single('upl'),function(req, res, next){
    console.log(req.body); // her
    console.log(req.file);
    res.status(204).end();
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


// TOURNAMENT CONTROLLERS
const limits = { fileSize: 512 * 512 * 512 };
//const fileFilter = { fileType: ".jpg"};
const tourUploads = multer({ dest: 'public/uploads/image/tournaments', limits: limits}).fields([{name: 'tour_image', maxCount: 1}, {name: 'prize_image', maxCount: 7}]);
router.post('/tournaments', tourUploads, ensureAdminAuthenticated, function (req, res) {
    console.log(req.files);

    const name = req.body.tour_name;
    const description = req.body.tour_info;
    const openingDate = req.body.opening_date;
    const closingDate = req.body.closing_date;
    const startDate = req.body.start_date;
    const tourDuration = req.body.tour_duration;
    const maxTeams = req.body.team_size;
    const maxTeamSize = req.body.team_maxsize;
    const minTeamSize = req.body.team_minsize;

    var isVisibel = req.body.visibility;
    if (typeof isVisibel === "undefined" || isVisibel !== true) {
        var isVisibel = false;
    } else {
        var isVisibel = true;
    }

    // define path for cover image
    const coverImagePath = req.files.tour_image[0].destination + "/" + req.files.tour_image[0].filename;
    const coverImage = coverImagePath.substring(6, Infinity);

    // spilt array and put values into object, then push objects into array
    var prizes = [];
    if (typeof req.body.prize_name !== "undefined") {
        const prize_name = req.body.prize_name;
        const prize_info = req.body.prize_info;
        const prize_image = req.files.prize_image;


        // prize_name will appear as a sting, if only one prize is posted
        if (typeof prize_name === "string") {
            var p_index = 0;
            var p_name = prize_name;
            var p_description = prize_info;
            console.log("1 "+prize_image[0]);
            var p_imagePath = prize_image[0].destination + "/" + prize_image[0].filename;
            console.log("2 "+p_imagePath);
            var p_image = p_imagePath.substring(6, Infinity);
            console.log("file "+p_image);
            prizes.push({p_index, p_name, p_description, p_image});

            // if prize_name is an array
        } else {
            if (prize_name.length === prize_info.length /*=== req.body.prize_image.length*/) {
                for (i = 0; i < prize_name.length; i++) {
                    var p_index = i;
                    var p_name = prize_name[i];
                    var p_description = prize_info[i];
                    var p_imagePath = prize_image[i].destination + "/" + prize_image[i].filename;
                    var p_image = p_imagePath.substring(6, Infinity);
                    prizes.push({p_index, p_name, p_description, p_image});
                }
            } else {
                req.flash('error_msg', 'En opstod under behandling');
                res.redirect('/admins/tournamnets');
            }
        }
    }

    // validation
    //req.checkBody('imagePath', 'Cover billede mangler').notEmpty();
    // req.checkBody('name', 'Name required').notEmpty();
    // req.checkBody('openingDate', 'Åbningsdato for tilmelding er nødvendig').notEmpty();
    // req.checkBody('closigDate', 'Lukkedato for tilmelding er nødvendig').notEmpty();
    // req.checkBody('startDate', 'Start dato er nødvendig').notEmpty();
    // req.checkBody('minTeamSize', 'Holdbegrænsning er nødvendigt').notEmpty();
    // req.checkBody('maxTeamSize', 'Maximum kan ikke være mindre end minimum').notEmpty(); //TODO: Skal samlignes med minTeamSize, for at undgå negativt tal

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin-backend/tournaments', {errors: errors});
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
            prizes: prizes,
            coverImage: coverImage
        });

        newTournament.save(function (err) {
            if (err) throw err;
            req.flash('success_msg', 'Turneringen er nu oprettet');
            res.status(204).end();
            res.redirect('/admins/tournaments');
        });
    }
});

// router.delete('/tournaments/:_id', ensureAdminAuthenticated, function (req, res) {
// });

TourRoute.delete(ensureAdminAuthenticated, function (req, res) {
   Tournament.findOne({_id: req.params._id}, function (err, tournament) {
        var tourImages = []; // create empty array for storing files
        var dirPath = "./public/uploads/image/tournaments/"; // directory where files are stored

        var imagePath = tournament.coverImage;
        var imageFile = imagePath.substring(imagePath.lastIndexOf("/")+1, Infinity);
        tourImages.push(imageFile);

        for (i=0; i<tournament.prizes.length;i++){
            imagePath = tournament.prizes[i].p_image;
            imageFile = imagePath.substring(imagePath.lastIndexOf("/")+1, Infinity);
            tourImages.push(imageFile);
        }

        // delete files
        for (i=0; i<tourImages.length; i++){
            var delFile = dirPath+tourImages[i];
            for (var i = 0; i < tourImages.length; i++) {
                (function (delFile) {
                    fs.exists(delFile, function (exists) {
                        if (exists) {
                            fs.unlinkSync(delFile);
                        } else {
                            console.log("file does not exist");
                        }
                    })
                })(dirPath + tourImages[i])
            }
        }
    });

    Tournament.findByIdAndRemove(req.params._id, function (err) {
        if (err) {
            res.send(err);
        }
    });
    req.flash('success_msg', 'Turneringen er nu slettet');
    res.status(204).redirect("/admins/tournaments");
});



mailRoute.post(function (req, res, next) {
    var modtager = req.body.modtager;
    var emne = req.body.emne;
    var txt = req.body.text;

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
        to: modtager, // list of receivers
        subject: emne, // Subject line
        text: txt, //, // plaintext body
        //html: '<b>Hello world </b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json({yo: 'error'});
        } else {
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        }

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
