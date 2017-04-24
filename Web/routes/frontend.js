/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


// GET HOMEPAGE
router.get('/', function (req, res) {
    res.render('frontend/index', {title: "S7 LAN"});
});


// RENDER 'REGISTER' VIEW
router.get('/signup', function (req, res) {
    res.render('frontend/signup', {title: "Tilmelding"});
});


// RENDER 'FORGOT PASSWORD' VIEW
router.get('/passwordreset', function (req, res) {
    res.render('frontend/reset_password', {title: "Gendan kodeord"});
});
router.post('/passwordreset', function (req, res, next) {
    app.mailer.send('email', {
        to: 'req.body.username', // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'Kodeord gendannelse', // REQUIRED.
        otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
    }, function (err) {
        if (err) {
            // handle error
            console.log("err" + err);
            res.send('There was an error sending the email');
            return;
        }
        res.send('Email Sent');
    });
});


// Register User
router.post('/signup', function (req, res) {
    var username = req.body.username;
    var age = req.body.age;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var studie = req.body.studie.toString();
    var fakultet = req.body.fakultet.toString();
    var bnet = req.body.bnet;
    var steam = req.body.steam;
    var isAdmin = req.body.admin;

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
        var newUser = new User({
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
        /*
         User.findOne({'local.email': email}, function (err, user) {
         // if there are any errors, return the error
         if (err)
         return done(err);

         // check to see if theres already a user with that email
         if (user) {
         return done(null, false, req.flash('error_msg', 'That email is already taken.'));
         } else {

         // if there is no user with that email
         // create the user
         var newUser = new User();

         // set the user's local credentials
         newUser.local.email = email;
         newUser.local.password = newUser.generateHash(password);

         // save the user
         newUser.save(function (err) {
         if (err)
         throw err;
         return done(null, newUser);
         });
         }

         });
         */

        User.findOne({username: username}, function (err, user) {
            if (err)
                return done(err);

            if (user) {
                console.log("user already exists.");
                req.flash('error_msg', 'Bruger eksisterer allerede');
                res.redirect('/signup');
            } else {
                console.log("created user with: " + user);
                User.createUser(newUser, function (err, username) {
                    if (err) throw err
                    console.log(username);
                    req.flash('success_msg', 'You are registered!');
                    res.redirect('/login');

                });
            }
        });


    }

});


// RENDER 'CONTACT' VIEW
router.get('/contact', function (req, res) {
    res.render('frontend/contact', {title: "Kontakt"});
});


// RENDER 'TOURNAMENTS' VIEW
router.get('/tournaments', function (req, res) {
    res.render('frontend/tournaments', {title: "Turneringer"});
});


// RENDER 'RULES' VIEW
router.get('/rules', function (req, res) {
    res.render('frontend/rules', {title: "Regler"});
});


// RENDER 'SEATS' VIEW
router.get('/seats', function (req, res) {
    res.render('frontend/seats', {title: "Pladskort"});
});


// RENDER 'EVENTS' VIEW
router.get('/events', function (req, res) {
    res.render('frontend/events', {title: "Dette Event"});
});


// RENDER LOGIN VIEW
router.get('/login', function (req, res) {
    res.render('frontend/login', {title: "Login"});

});


// LOGOUT
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'Du er nu logget ud');
    res.redirect('/login');
});


// RENDER DASHBOARD VIEW
router.get('/dashboard', ensureAuthenticated, function (req, res) {
    if (req.user.isAdmin === true) {
        console.log("Admin entered his dashboard");
        res.render('admin-backend/adminsDashboard', {title: "Dashboard"});
    } else if (req.user === true) {
        console.log("User entered his dashboard");
        res.render('user-backend/usersDashboard', {title: "Dashboard"});
    }
});


passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Ukendt Bruger - Husk forskel på store og små bogstaver.'});
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        })
    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
    //console.log("USER: "+user.username+" | ID: "+user.id);
    console.log(user)
});


passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});


// GET DATA FROM LOGIN PAGE
router.post('/login',
    passport.authenticate('local', {successRedirect: '/dashboard', failureRedirect: '/login', failureFlash: true}),

    function (req, res) {
        console.log("LOGGED IN!");
        res.redirect('/dashboard')
    });

// ENSURE USER IS LOGGED IN
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'Du er ikke logget ind');
        res.redirect('/login');
    }
}

module.exports = router;