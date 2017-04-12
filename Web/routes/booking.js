/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
var router = express.Router();

// RENDER SEATGROUP VIEW
router.get('/seatgroups', function(req, res){
    res.render('seatgroups');
});


module.exports = router;
