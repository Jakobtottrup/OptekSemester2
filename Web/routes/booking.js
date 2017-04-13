/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
var router = express.Router();

var Group = require('../models/booking');

// RENDER SEATGROUP VIEW
router.get('/seatgroups', function(req, res){
    res.render('seatgroups');
});


// REGISTER GROUP
router.post('/seatgroups', function(req, res){
    var groupName = req.body.groupName;
    var password = req.body.password;
    var password2 = req.body.password2;
    var members = [];
    var leaderID = null;
    var eventID = null;
    var creationDate ;

    console.log("gruppenavn: " + groupName + " | passwords: " + password + " / " + password2);

    // VALIDATION
    req.checkBody('groupName', 'Gruppenavn er nødvendigt').notEmpty();
    req.checkBody('password', 'Kodeord er nødvendigt').notEmpty();
    req.checkBody('password2', 'Tjek venligst at kodeordene stemmer overens').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.render('index',{
            errors:errors
        });
        console.log(errors);
    } else {
        var newGroup = new Group({
            groupName: groupName,
            password: password,
            members: members,
            leaderID: leaderID,
            eventID: eventID,
            creationDate: creationDate
        });

        Group.createGroup(newGroup, function(err, group){
            if(err) throw err;
            console.log(group);
        });
        req.flash('success_msg', 'Gruppen er nu oprettet');
        res.redirect('/booking/seatgroups');
    }

});

module.exports = router;
