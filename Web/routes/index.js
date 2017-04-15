/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
var router = express.Router();

// GET HOMEPAGE
router.get('/', function(req, res){
   res.render('frontend/index', {title: "S7 LAN"});
});


// RENDER 'REGISTER' VIEW
router.get('/signup', function(req, res){
    res.render('frontend/signup', {title: "Tilmelding"});
});


// RENDER 'CONTACT' VIEW
router.get('/contact', function(req, res){
    res.render('frontend/contact', {title: "Google Maps test page"});
});


// RENDER 'TOURNAMENTS' VIEW
router.get('/tournaments', function(req, res){
    res.render('frontend/tournaments', {title: "Google Maps test page"});
});


// RENDER 'RULES' VIEW
router.get('/rules', function(req, res){
    res.render('frontend/rules', {title: "Google Maps test page"});
});


// RENDER 'EVENTS' VIEW
router.get('/events', function(req, res){
    res.render('frontend/events', {title: "Google Maps test page"});
});



// RENDER LOGIN VIEW
router.get('/login', function(req, res){
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


// CHECK IF USER TRIES TO ENTER UNALLOWED ROUTE
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/frontend/login', {title: "Login"});
    }
}


module.exports = router;