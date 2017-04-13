/**
 * Created by chris on 11-04-2017.
 */


//// USED TO DISPLAY ADMIN BACKEND PANEL ////


var express = require('express');
var router = express.Router();


// RENDER REGISTER VIEW
router.get('/adminpanel', function(req, res){
    res.render('admin-backend/adminpanel');
});


module.exports = router;
