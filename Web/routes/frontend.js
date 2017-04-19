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

    /*
     // STORE CURRENT LOGIN
     var username = req.body.username;   // TODO: Skal rettes, så den peger på det rette textfelt
     var password = req.body.password;   // TODO: Skal rettes, så den peger på det rette textfelt

     user.fineOne({username: username, password: password}, function(err, user){
     if (err){
     console.log(err);
     return res.status(500).esnd();
     }
     if(!user){
     return res.status(404).send();
     }
     req.session.user = user;
     return res.status(200).send();
     })
     */
});


/*
 // AUTHENTICATE LOGIN
 router.post('/login',
 passport.authenticate('local', {successRedirect:'/', failureRedirect:'/index/login',failureFlash: true}),
 function(req, res) {
 res.redirect('/');
 });

 router.get('/logout', function(req, res){
 req.logout();

 req.flash('success_msg', 'You are logged out');

 res.redirect('/users/login');
 });






 // CHECK IF USER TRIES TO ENTER UNALLOWED ROUTE
 function ensureAuthenticated(req, res, next){
 if(req.isAuthenticated()){
 return next();
 } else {
 //req.flash('error_msg','You are not logged in');
 res.redirect('/frontend/login', {title: "Login"});
 }
 }
 */
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if(err) throw err;
            if(!user) {
                return done(null, false, {message: 'Unkown User'});
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
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/login', failureFlash: true}),

    function (req, res) {
        res.redirect('/')
    });

module.exports = router;