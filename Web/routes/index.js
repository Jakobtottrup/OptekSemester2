/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
var router = express.Router();

// GET HOMEPAGE
router.get('/', function(req, res){
   res.render('index');
});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;