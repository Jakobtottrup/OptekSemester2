/**
 * Created by chris on 26-04-2017.
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const mailer = require('express-mailer');
const User = require('../models/user');





router.post('/mail/resetpassword', function (req, res, next) {
    /*app.mailer.send('email', {
        to: 'christianskjerning@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'Test Email', // REQUIRED.
        otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
    }, function (err) {
        if (err) {
            // handle error
            console.log(err);
            res.send('There was an error sending the email');
            return;
        }
        res.send('Email Sent');
    });*/
});
