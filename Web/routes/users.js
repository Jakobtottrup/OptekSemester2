/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');

var Group = require('../models/booking');


// RENDER REGISTER VIEW
router.get('/register', function(req, res){
    res.render('frontend/register');
});


// RENDER LOGIN VIEW
router.get('/login', function(req, res){
    res.render('frontend/login');
});


module.exports = router;
