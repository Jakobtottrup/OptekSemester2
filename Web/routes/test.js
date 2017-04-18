/**
 * Created by chris on 11-04-2017.
 */


///// ONLY USED FOR TESTING //////
var express = require('express');
var router = express.Router();

// RENDER BOOK TEST VIEW
router.get('/books-test', function(req, res){
    res.render('frontend/books-test', {title: "database connection test"});
});


module.exports = router;