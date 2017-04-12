/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
var router = express.Router();

// RENDER REGISTER VIEW
router.get('/register', function(req, res){
    res.render('register');
});

// RENDER LOGIN VIEW
router.get('/login', function(req, res){
    res.render('login');
});

module.exports = router;
