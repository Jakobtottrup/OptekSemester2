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
const rimraf = require('rimraf');


// DECLARING MODELS AND ROUTES
const seats = require('../models/seats');
const User = require('../models/user');
const Tournament = require('../models/tournaments');
const Group = require('../models/seatingGroups');
const Event = require('../models/event');
const Fb_post = require('../models/fb_posts');
const router = express.Router();
const userRoute = router.route('/users/:_id/:adminClicked/:paymentClicked');
const delRoute = router.route('/users/:_id');
const tourRoute = router.route('/tournaments/:_id');
const galleryRoute = router.route('/gallery/:id');
const mailRoute = router.route('/mails');
const thisEvent = router.route('/events');

// MULTER SETTINGS
const limits = {fileSize: 512 * 512 * 512};
//const fileFilter = { fileType: ".jpg"};
const tourUploads = multer({dest: 'public/uploads/image/tournaments', limits: limits}).fields([{
    name: 'tour_image',
    maxCount: 1
}, {name: 'prize_image', maxCount: 3}]);

const galleryUploads = multer({dest: 'public/uploads/image/gallery', limits: limits}).fields([{
    name: 'up1'
}]);


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
    res.render('admin-backend/events', {title: "LAN"});
});


// RENDER MAILS VIEW
router.get('/mails', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/mails', {title: "Mails"});
});


router.post('/create_seats', ensureAdminAuthenticated, function (req, res) {
    let seatName = req.body.seatName;

    // VALIDATION
    req.checkBody('seatName', 'Pladsnavn er nødvendigt').notEmpty();

    let errors = req.validationErrors();
    if (errors) { // if validation fails
        res.render('frontend/index', {
            errors: errors
        });
    } else { //if validation succeeds server sends data to database using modelschema "users.js"

        let newSeat = new seats({
            container: seatName
        });

        seats.remove({}, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    newSeat.save(function (err) {
                        if (err) throw err;
                    });

                    res.end('success');
                }
            }
        );

        res.redirect('/admins/create_seats');

    }
});

// RENDER GALLERY UPLOAD VIEW
router.get('/gallery', ensureAdminAuthenticated, function (req, res) {
    res.render('admin-backend/gallery', {title: 'Galleri'});
});

// GALLERY UPLOAD
router.post('/gallery', ensureAdminAuthenticated, galleryUploads, function (req, res) {
    res.redirect('/admins/gallery');
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
    User.findByIdAndRemove(req.params._id, function (err) {
        if (err)
            res.send(err);
        res.json({message: 'User removed from the DB!'});
    });
});


/** ********************** **/
/** TOURNAMENT CONTROLLERS **/
/** ********************** **/

// TOURNAMENT CONTROLLERS
router.post('/tournaments', tourUploads, ensureAdminAuthenticated, function (req, res) {
    const name = req.body.tour_name;
    const description = req.body.tour_info;
    const openingDate = req.body.opening_date;
    const closingDate = req.body.closing_date;
    const startDate = req.body.start_date;
    const tourDuration = req.body.tour_duration;
    const maxTeams = req.body.team_size;
    const maxTeamSize = req.body.team_maxsize;
    const minTeamSize = req.body.team_minsize;

    let isVisibel = req.body.visibility;
    if (isVisibel === "on" || typeof isVisibel !== "undefined") {
        isVisibel = true;
    } else {
        isVisibel = false;
    }


    // define path for cover image
    const coverImagePath = req.files.tour_image[0].destination + "/" + req.files.tour_image[0].filename;
    const coverImage = coverImagePath.substring(6, Infinity);

    // spilt array and put values into object, then push objects into array
    let prizes = [];
    if (typeof req.body.prize_name !== "undefined") {
        const prize_name = req.body.prize_name;
        const prize_info = req.body.prize_info;
        const prize_image = req.files.prize_image;


        // prize_name will appear as a sting, if only one prize is posted
        if (typeof prize_name === "string") {
            let p_index = 0;
            let p_name = prize_name;
            let p_description = prize_info;
            let p_imagePath = prize_image[0].destination + "/" + prize_image[0].filename;
            let p_image = p_imagePath.substring(6, Infinity);
            prizes.push({p_index, p_name, p_description, p_image});

            // if prize_name is an array
        } else {
            if (prize_name.length === prize_info.length /*=== req.body.prize_image.length*/) {
                for (i = 0; i < prize_name.length; i++) {
                    let p_index = i;
                    let p_name = prize_name[i];
                    let p_description = prize_info[i];
                    let p_imagePath = prize_image[i].destination + "/" + prize_image[i].filename;
                    let p_image = p_imagePath.substring(6, Infinity);
                    prizes.push({p_index, p_name, p_description, p_image});
                }
            } else {
                req.flash('error_msg', 'En fejl opstod under behandling');
                res.redirect('/admins/tournamnets');
            }
        }
    }

    // validation
    // req.checkBody('imagePath', 'Cover billede mangler').notEmpty();
    // req.checkBody('name', 'Name required').notEmpty();
    // req.checkBody('openingDate', 'Åbningsdato for tilmelding er nødvendig').notEmpty();
    // req.checkBody('closigDate', 'Lukkedato for tilmelding er nødvendig').notEmpty();
    // req.checkBody('startDate', 'Start dato er nødvendig').notEmpty();
    // req.checkBody('minTeamSize', 'Holdbegrænsning er nødvendigt').notEmpty();
    // req.checkBody('maxTeamSize', 'Maximum kan ikke være mindre end minimum').notEmpty(); //TODO: Skal samlignes med minTeamSize, for at undgå negativt tal

    let errors = req.validationErrors();

    if (errors) {
        res.render('admin-backend/tournaments', {errors: errors});
    } else {
        let newTournament = new Tournament({
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
            res.redirect('/admins/tournaments');
        });
    }
});


router.post('/tourupdate', tourUploads, ensureAdminAuthenticated, function (req, res) {
    Tournament.findOne({_id: req.body.tour_id}, function (err, tournament) {  // søgekriterie skal ændres til ID på turneringen
        console.log(tournament);
        const name = req.body.tour_name;
        const description = req.body.tour_info;
        const openingDate = req.body.opening_date;
        const closingDate = req.body.closing_date;
        const startDate = req.body.start_date;
        const tourDuration = req.body.tour_duration;
        const maxTeams = req.body.team_size;
        const maxTeamSize = req.body.team_maxsize;
        const minTeamSize = req.body.team_minsize;
        const updatedAt = new Date();

        let isVisibel = req.body.visibility;
        if (isVisibel === "on" || typeof isVisibel !== "undefined") {
            isVisibel = true;
        } else {
            isVisibel = false;
        }

        // define path for cover image
        const coverImagePath = req.files.tour_image[0].destination + "/" + req.files.tour_image[0].filename;
        const coverImage = coverImagePath.substring(6, Infinity);

        // spilt array and put values into object, then push objects into array
        let prizes = [];
        if (typeof req.body.prize_name !== "undefined") {
            const prize_name = req.body.prize_name;
            const prize_info = req.body.prize_info;
            const prize_image = req.files.prize_image;


            // prize_name will appear as a sting, if only one prize is posted
            if (typeof prize_name === "string") {
                let p_index = 0;
                let p_name = prize_name;
                let p_description = prize_info;
                let p_imagePath = prize_image[0].destination + "/" + prize_image[0].filename;
                let p_image = p_imagePath.substring(6, Infinity);
                prizes.push({p_index, p_name, p_description, p_image});

                // if prize_name is an array
            } else {
                if (prize_name.length === prize_info.length) {
                    for (i = 0; i < prize_name.length; i++) {
                        let p_index = i;
                        let p_name = prize_name[i];
                        let p_description = prize_info[i];
                        let p_imagePath = prize_image[i].destination + "/" + prize_image[i].filename;
                        let p_image = p_imagePath.substring(6, Infinity);
                        prizes.push({p_index, p_name, p_description, p_image});
                    }
                } else {
                    req.flash('error_msg', 'En fejl opstod under behandling');
                    res.redirect('/admins/tournamnets');
                }
            }
        }

        tournament = {
            name,
            description,
            openingDate,
            closingDate,
            startDate,
            tourDuration,
            maxTeams,
            maxTeamSize,
            minTeamSize,
            prizes,
            coverImage,
            updatedAt
        };
        console.log("new", tournament);
        tournament.save(function (err) {
            if (err) throw err;
            req.flash('success_msg', 'Ændringerne blev gemt');
            res.redirect('/admins/tournaments')
        });
    });
});


tourRoute.delete(ensureAdminAuthenticated, function (req, res) {
    Tournament.findOne({_id: req.params._id}, function (err, tournament) {
        let tourImages = []; // create empty array for storing files
        let dirPath = "./public/uploads/image/tournaments/"; // directory where files are stored

        let imagePath = tournament.coverImage;
        let imageFile = imagePath.substring(imagePath.lastIndexOf("/") + 1, Infinity);
        tourImages.push(imageFile);

        for (i = 0; i < tournament.prizes.length; i++) {
            imagePath = tournament.prizes[i].p_image;
            imageFile = imagePath.substring(imagePath.lastIndexOf("/") + 1, Infinity);
            tourImages.push(imageFile);
        }

        // delete files
        for (i = 0; i < tourImages.length; i++) {
            let delFile = dirPath + tourImages[i];
            for (let i = 0; i < tourImages.length; i++) {
                (function () {
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
    res.redirect("/admins/tournaments");
});


mailRoute.post(ensureAdminAuthenticated, function (req, res, next) {
        let modtager = req.body.modtager;
        let emne = req.body.emne;
        let txt = req.body.text;
        let noPayment = req.body.array;
        let allUsers = req.body.all_user_emails;


        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'sdulan.optek@gmail.com', // Your email id
                pass: 'OpTek2016' // Your password
            }
        });


        let notPaid = {
            from: 'sdulan.optek@gmail.com',
            to: 'jatoe13@student.sdu.dk',
            subject: 'S7Lan Betalingspåmindelse',
            text: 'Du modtager denne email, da vi endnu ikke har registreret din betaling for det kommende S7Lan event.\n\n' +
            'Du bedes venligst indbetale beløbet så hurtigt som muligt, så du også har mulighed for at reservere en plads.\n\n' +
            'Hvis du mener du allerede har betalt, bedes du venligst kontakte en administrator på email: sdulan.optek@gmail.com'
        };

        let mailOptions = {
            from: 'sdulan.optek@gmail.com', // sender address
            to: modtager, // list of receivers
            subject: emne, // Subject line
            text: txt, //, // plaintext body
            //html: '<b>Hello world </b>' // You can choose to send an HTML body instead
        };

        if (req.body.modtager === 'ALL UNPAID') {
            if (typeof noPayment !== 'string') {
                for (i = 0; i < noPayment.length; i++) {
                    (function (i) {
                        setTimeout(function () {
                            notPaid.to = noPayment[i];
                            transporter.sendMail(notPaid, function (error, info) {
                                if (error) {
                                    console.log(error);
                                    res.json({yo: 'error'});
                                } else {
                                    console.log('Message sent: ' + info.response);
                                }
                            })
                        }, 3000 * i);
                    })(i);
                }
            } else if (typeof noPayment === 'string') {
                notPaid.to = noPayment;
                transporter.sendMail(notPaid, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.json({yo: 'error'});
                    } else {
                    }
                })
            }
            req.flash('success_msg', 'Betalingspåmindelse sendt!');
            res.redirect('/admins/mails');

        } else if (req.body.modtager === 'ALL USERS') {
            for (i = 0; i < allUsers.length; i++) {
                (function (i) {
                    setTimeout(function () {
                        mailOptions.to = allUsers[i];
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                res.json({yo: 'error'});
                            } else {
                            }
                        })
                    }, 3000 * i);
                })(i);
            }
            req.flash('success_msg', 'Email sendt til alle brugere!');
            res.redirect('/admins/mails');

        }

        else {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.json({yo: 'error'});
                } else {
                    console.log('Message sent: ' + info.response);
                    req.flash('success_msg', 'Email sendt!');
                    res.redirect('/admins/mails');
                }
            });
        }
    }
);


// reset event
thisEvent.put(ensureAdminAuthenticated, function (req, res) {
    // delete collections
    Group.collection.drop();
    Tournament.collection.drop();
    // reset user states
    User.update({hasPaid: true}, {hasPaid: false}, {multi: true}, function () {
    });
    User.update({isActive: true}, {isActive: false}, {multi: true}, function () {
    });

    // delete images
    let tournamnetDir = 'public/uploads/image/tournaments';
    rimraf(tournamnetDir, function () {
        if (!fs.existsSync(tournamnetDir)) {
            fs.mkdirSync(tournamnetDir);
        }
    });

    req.flash('success_msg', 'Alt er nu slettet');
    res.redirect(304, '/admins/events');
});

router.post('/events', ensureAdminAuthenticated, function (req, res) {
    const doc_id = "event_doc"; // predefines document ID for easy update of document
    const location = req.body.event_location;
    const description = req.body.event_description;
    const eventTime = req.body.event_date;
    const price = req.body.price;
    const maxGuests = req.body.max_guests;
    Event.findById({_id: doc_id}, function (err, event_doc) {
        if (err) throw err;
        if (event_doc === null) {
            // create new document
            let newEvent = new Event({
                _id: doc_id,
                description: description,
                eventTime: eventTime,
                price: price,
                maxGuests: maxGuests,
                location: location
            });
            newEvent.save(function (err) {
                if (err) throw err;
                req.flash('success_msg', 'Eventet er nu oprettet');
                res.redirect('/admins/events');
            });

            // update existing document
        } else {
            event_doc.description = description;
            event_doc.eventTime = eventTime;
            event_doc.location = location;
            event_doc.price = price;
            event_doc.save(function (err) {
                if (err) throw err;
                req.flash('success_msg', 'Indstillingerne blev gemt');
                res.redirect('/admins/events');
            });
        }
    });
});


// DELETE GALLERY IMAGES
let dirPath = "./public/uploads/image/gallery/";
galleryRoute.delete(ensureAdminAuthenticated, function (req, res) {
    let id = req.params.id;
    let delFile = dirPath + id;

    fs.exists(delFile, function (exists) {
        if (exists) {
            fs.unlinkSync(delFile);
        } else {
            req.flash('error_msg', "Billede " + id + " eksisterer ikke");
            res.redirect("/admins/gallery");
        }
    });
    req.flash('success_msg', "Billede " + id + " er nu slettet");
    res.redirect("/admins/gallery");
});

// SET FACEBOOK SETTINGS
router.post('/posts', ensureAdminAuthenticated, function (req, res) {
    const posts_id = JSON.parse(req.body.posts_id);
    const doc_id = "fb_posts"; // predefines document ID for easy update of document

    const new_posts_id = posts_id;
    Fb_post.findByIdAndUpdate({_id: doc_id}, {fb_posts: new_posts_id}, function (err, fb_posts) {
        if (err) throw err;
        if (fb_posts === null) {
            // create new document
            let newFb_post = new Fb_post({
                posts_id: posts_id,
                _id: doc_id
            });
            newFb_post.save(function (err) {
                if (err) throw err;
                req.flash('success_msg', 'Indstillingerne blev gemt');
                res.redirect('/admins/posts')
            });
            // update existing document
        } else {
            fb_posts.posts_id = new_posts_id;
            fb_posts.save(function (err) {
                if (err) throw err;
                req.flash('success_msg', 'Indstillingerne blev gemt');
                res.redirect('/admins/posts')
            });
        }
    });
});

module.exports = router;

