/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


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
router.post('/passwordreset', function(req, res, next) {
    app.mailer.send('email', {
        to: 'req.body.username', // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'Kodeord gendannelse', // REQUIRED.
        otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
    }, function (err) {
        if (err) {
            // handle error
            console.log("err"+err);
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
    var studie = req.body.studie;
    var bnet = req.body.bnet;
    var steam = req.body.steam;

    //validation

    req.checkBody('username', 'Name required').notEmpty();
    req.checkBody('age', 'Age required').notEmpty();
    req.checkBody('email', 'Email required').notEmpty();
    req.checkBody('email', 'Invalid email format').isEmail();
    req.checkBody('password', 'Password required').notEmpty();
    req.checkBody('studie', 'Studie required').notEmpty();


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
            bnet: bnet,
            steam: steam
        });

        User.createUser(newUser, function (err, user) {
            if (err) throw err;
            console.log(user);

        });
        req.flash('success_msg', 'You are registered!');
        res.redirect('/login');
    }

});


// RENDER 'CONTACT' VIEW
router.get('/contact', function (req, res) {
    res.render('frontend/contact', {title: "Google Maps test page"});
});


// RENDER 'TOURNAMENTS' VIEW
router.get('/tournaments', function (req, res) {
    res.render('frontend/tournaments', {title: "Google Maps test page"});
});


// RENDER 'RULES' VIEW
router.get('/rules', function (req, res) {
    res.render('frontend/rules', {title: "Google Maps test page"});
});


// RENDER 'SEATS' VIEW
router.get('/seats', function (req, res) {
    res.render('frontend/seats', {title: "Pladskort"});
});


// RENDER 'EVENTS' VIEW
router.get('/events', function (req, res) {
    res.render('frontend/events', {title: "Google Maps test page"});
});


// RENDER LOGIN VIEW
router.get('/login', function (req, res) {
    res.render('frontend/login', {title: "Login"});

});



passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if(err) throw err;
            if(!user) {
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if(err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        })
    }
));
passport.serializeUser(function(user, done) {
    done(null, user.id);
    console.log("USER: "+user.username+" | ID: "+user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: true}),

    function (req, res) {
        console.log("LOGGED IN!");
        res.redirect('/users/userpanel')
    });


// LOGOUT
router.get('/logout', function(req, res){
   req.logout();
   req.flash('succes_msg', 'Du er nu logget ud');
   res. redirect('/');
});


module.exports = router;