/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
var router = express.Router();

// GET HOMEPAGE
router.get('/', function(req, res){
   res.render('index');
});

module.exports = router;