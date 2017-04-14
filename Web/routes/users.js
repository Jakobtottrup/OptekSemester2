/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
var router = express.Router();



// THESE VIEWS ARE ONLY ALLOWED IF USER IS LOGGED IN //

// USER DASHBOARD
router.get('/userdashboard', function(req, res) {
    if(!req.session.user){
        return res.status(401).send();

    }
    res.render('user-backend/userdashboard', {title: "Dashboard"});
    return res.status(200).send("Welcome to the userdashboard");
});



// RENDER SEATGROUP VIEW
router.get('/seatgroups', function(req, res){
    res.render('user-backend/seatgroups', {title: "Siddegrupper"});
});


// REGISTER GROUP
var Group = require('../models/seatingGroups');
router.post('/seatgroups', function(req, res){
    var groupName = req.body.groupName;
    var password = req.body.password;
    var password2 = req.body.password2;
    var members = [];
    var leaderID = null;
    var eventID = null;

    //console.log("gruppenavn: " + groupName + " | passwords: " + password + " / " + password2);

    // VALIDATION
    req.checkBody('groupName', 'Gruppenavn er nødvendigt').notEmpty();
    req.checkBody('password', 'Kodeord er nødvendigt').notEmpty();
    req.checkBody('password2', 'Tjek venligst at kodeordene stemmer overens').equals(req.body.password);


    var errors = req.validationErrors();
    if(errors){ // if validation fails
        res.render('frontend/index',{
            errors:errors
        });
        console.log(errors);
    } else { //if validation succeeds server sends data to database using modelschema "users.js"
        var newGroup = new Group({
            groupName: groupName,
            password: password,
            members: members,
            leaderID: leaderID,
            eventID: eventID
        });

        Group.createGroup(newGroup, function(err, group){
            if(err) throw err;
            //console.log(group);
        });
        req.flash('success_msg', 'Gruppen er nu oprettet');
        res.redirect('/user-backend/seatgroups');
    }

});



module.exports = router;