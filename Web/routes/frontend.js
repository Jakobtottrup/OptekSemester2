/**
 * Created by chris on 11-04-2017.
 */
const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const multer = require('multer');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const flash = require('connect-flash');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');


// GET HOMEPAGE
router.get('/', function (req, res) {
    res.render('frontend/index', {title: "S7 LAN"});
});


// RENDER 'REGISTER' VIEW
router.get('/signup', function (req, res) {
    if (typeof req.user !== "undefined") {
        res.redirect('/dashboard');
    } else {
        res.render('frontend/signup', {title: "Tilmelding"});
    }
});


// RENDER 'FORGOT PASSWORD' VIEW
router.get('/passwordreset', function (req, res) {
    res.render('frontend/passwordreset', {title: "Gendan kodeord"});
});


router.post('/passwordreset', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({email: req.body.email}, function (err, user) {
                if (!user) {
                    req.flash('error_msg', 'Ingen bruger med indtastede email fundet.');
                    return res.redirect('/passwordreset');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
                user.save(f unction (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'sdulan.optek@gmail.com',
                    pass: 'OpTek2016'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'sdulan.optek@gmail.com',
                subject: 'S7-Lan Password gendannelse',
                text: 'Du modtager denne mail fordi du, eller en anden har forsøgt at ændre password til din konto.\n\n' +
                'Du bedes venligst klikke på følgende link, eller kopiere adressen ind i din browser for at fuldføre gendannelsen:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'Hvis du ikke ønsker at gendanne dit password, skal du ignorere denne mail og dit password forbliver det samme.\n'
            };
            transporter.sendMail(mailOptions, function (err) {
                req.flash('success_msg', 'En e-mail er blevet sendt til ' + user.email + ' med yderligere instruktioner.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/passwordreset');
    });
});
router.get('/reset/:token', function (req, res) {
    var date2 = Date.now();
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: date2}}, function (err, user) {
        if (!user) {
            req.flash('error_msg', 'Password gendannelse link er ugyldig eller udløbet.');
            return res.redirect('/passwordreset');
        }
        res.render('frontend/reset', {user});
    });
});


router.post('/reset/:token', function (req, res) {

    var date3 = Date.now();
    async.waterfall([
            function (done) {
                User.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: {$gt: date3}
                }, function (err, user) {
                    if (!user) {
                        req.flash('error_msg', 'Password gendannelse link er ugyldig eller udløbet.');
                        return res.redirect('/reset/:token');
                    }
                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(user.password, salt, function (err, hash) {
                            user.password = hash;
                            user.save(function (err) {
                                done(err, user)
                            });
                        });
                    });
                });
            },
            function (user, done) {
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'sdulan.optek@gmail.com',
                        pass: 'OpTek2016'
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'sdulan.optek@gmail.com',
                    subject: 'S7-Lan Password reset Success!',
                    text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                };
                transporter.sendMail(mailOptions, function (err) {
                    req.flash('success_msg', 'Password ændret!2');
                    res.redirect('/login');
                    done(err);
                });
            }
        ],
        function (err) {
            res.redirect('/');
        });
});


// render gallery view
router.get('/gallery', function (req, res) {
    res.render('frontend/gallery', {title: "Galleri"});
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
            isAdmin: false,
            hasPaid: false,
            isActive: false,
            createdAt: Date.now()
        });

        User.findOne({username: username}, function (err, user) {
            if (err)
                return done(err);
            if (user) {
                req.flash('error_msg', 'Bruger eksisterer allerede');
                res.redirect('/signup');
            } else {
                User.createUser(newUser, function (err, username) {
                    if (err) throw err;
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'sdulan.optek@gmail.com',
                            pass: 'OpTek2016'
                        }
                    });
                    var mailOptions = {
                        to: newUser.email,
                        from: 'sdulan.optek@gmail.com',
                        subject: 'S7-Lan Konto Oprettet!',
                        text: 'Hej,\n\n' +
                        'Dette er en bekræftelsesmail for at konto med brugernavn: ' + newUser.username + ' netop er blevet oprettet i vores system.\n'
                    };
                    transporter.sendMail(mailOptions, function (err) {
                        req.flash('success_msg', 'Du er nu registreret!');
                        res.redirect('/login');
                        done(err);
                    });
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
    res.render('frontend/events', {title: "LAN"});
});


// RENDER LOGIN VIEW
router.get('/login', function (req, res) {
    if (typeof req.user !== "undefined") {
        res.redirect('/dashboard');
    } else {
        res.render('frontend/login', {title: "Login"});
    }
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
        res.render('admin-backend/adminsDashboard', {title: "Dashboard"});
    } else if (typeof req.user === "object") {
        res.render('user-backend/usersDashboard', {title: "Dashboard"});
    } else {

        res.redirect('/login', {title: "Login"});
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
                    return done(null, false, {message: 'Ukendt kodeord'});
                }
            });
        })
    }));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            // *** Display message using Express 3 locals
            req.flash('error_msg', 'Ugyldige login detaljer - Husk forskel på store og små bogstaver');
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/dashboard');
        });
    })(req, res, next);
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