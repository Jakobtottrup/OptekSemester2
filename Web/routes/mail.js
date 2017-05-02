/**
 * Created by chris on 26-04-2017.
 */
/*
var nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
//const mailer = require('express-mailer');
const User = require('../models/user');




router.post('admins/mails', function (req, res, next) {


    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'sdulan.optek@gmail.com', // Your email id
            pass: 'OpTek2016' // Your password
        }
    });

    var text = 'Hello world from \n\n' + req.body.name;

    var mailOptions = {
        from: 'sdulan.optek@gmail.com>', // sender address
        to: 'cskje16@student.sdu.dk', // list of receivers
        subject: 'Email Test Example', // Subject line
        text: text //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });
    /!*app.mailer.send('email', {
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
    });*!/
});
*/
