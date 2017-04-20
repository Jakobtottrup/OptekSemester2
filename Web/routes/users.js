/**
 * Created by chris on 11-04-2017.
 */
var express = require('express');
//var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// THESE VIEWS ARE ONLY ALLOWED IF USER IS LOGGED IN //

// USER DASHBOARD
router.get('/userpanel', function(req, res){
    res.render('user-backend/usersDashboard', {title: "Dashboard", name: "Brugers navn"}); //TODO: skal ændres til req.user.name (eller noget der henter brugerens navn
});

/*
router.get('/userpanel', function(req, res) {
    res.render('user-backend/userdashboard', {title: "Dashboard"});
    if(!req.session.user){
        return res.status(401).send();

    }
    res.render('user-backend/usersDashboard.handlebars', {title: "Dashboard"});
    return res.status(200).send("Welcome to the userdashboard");
});
*/


// RENDER SEATGROUP VIEW
router.get('/seatgroups', function(req, res){
    // GET SEATGROUPS
    Group.find({}, function(err, seatgroups){
        if(err) throw err;
        groupData = seatgroups;
        //console.log(groupData);
        res.render('user-backend/seatgroups', {title: "Siddegrupper", data: groupData});
    });
});


// REGISTER GROUP
var Group = require('../models/seatingGroups');
router.post('/seatgroups', function(req, res){
    var groupName = req.body.groupName;
    var password = req.body.password;
    var password2 = req.body.password2;
    var members = [];
    var leaderID = null; //req.user.id

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
            leaderID: leaderID
        });

        Group.createGroup(newGroup, function(err, group){
            if(err) throw err;
            //console.log(group);
        });
        req.flash('success_msg', 'Gruppen er nu oprettet');
        res.redirect('/users/seatgroups');
    }
});




module.exports = router;