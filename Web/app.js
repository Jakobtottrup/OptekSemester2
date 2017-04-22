//console.log(" ____      _      .  .    ___     ___         __       .    .    ___      ___     ___ \n     |    / \\     | /    /   \\   |   \\       |  \\      |\\   |   /   \\    /   \\   |   \\ \n     |   /___\\    |/    |     |  |___/       |__/      | \\  |  |     |  |     |  |___/\n     |  /     \\   |\\    |     |  |   \\       | \\       |  \\ |  |     |  |     |  |   \\ \n\\___/  /       \\  | \\    \\___/   |___/       |  \\      |   \\|   \\___/    \\___/   |___/");
console.log(">> R E M E M B E R   T O   U P D A T E   M O D U L E S << \n\t\t\t -> npm install\n\t\t\t -> bower install \n");

// Init Modules
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mailer = require('express-mailer');
const helpers = require('handlebars-helpers')();

// DATABASE CONNECTION
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://optek:optek123@ds153400.mlab.com:53400/heroku_fxdl0qct'); //url works properly - checked
const db = mongoose.connection;


const routes = require('./routes/frontend'); //main index (front page)
const users = require('./routes/users'); //user pages
const admins = require('./routes/admins'); //admin-backend route
const api = require('./routes/api'); // used for exporting data to client-scripts


// Init App
const app = express();

app.use(session({
    //cookie: {maxAge: Infinity},
    secret: 'woot',
    resave: false,
    saveUninitialized: false
}));


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');



// HANDLEBARS-HELPERS
exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        uppercase: function(str, options) {
            if (str && typeof str === 'string') {
                return str.toUpperCase();
            } else {
                options = str;
            }
            if (typeof options === 'object' && options.fn) {
                return options.fn(this).toUpperCase();
            }
            return '';
        }
    }
});


// Express Session
/*app.configure(function() {
 app.use(express.static('public'));
 app.use(express.cookieParser());
 app.use(express.bodyParser());
 app.use(express.session({ secret: 'keyboard cat' }));
 app.use(passport.initialize());
 app.use(passport.session());
 app.use(app.router);
 });*/


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


// Set Static Folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));


// Passport Init
app.use(passport.initialize());
app.use(passport.session());


//Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


// Connect Flash
app.use(flash());

//Global Vars for Connect Flash
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    res.locals.admin = req.admin || null;
    next();
});


// PUBLIC ROUTES
app.use('/', routes);
app.use('/users', users);
app.use('/admins', admins);
app.use('/api', api);
app.use("*", function (req, res) {
    res.status(404).render('layouts/error404', {title: "Siden blev ikke fundet"});
});


//Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'));
});


// EXPRESS MAILER
mailer.extend(app, {
    from: 'no-reply@s7lan.dk',
    host: 'smtp.gmail.com', // hostname
    secureConnection: false, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'gmail.user@gmail.com',
        pass: 'userpass'
    }
});


// CONSOLE LOGS
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connection established!");  //                                                                                                                                                                                                                                                                                              var c="\n   #####  #     # #######    ######  ### #    #     #####  #     # ######  ###  #####  ####### ###    #    #     #",h="\n  #     # #     #    #       #     #  #  #   #     #     # #     # #     #  #  #     #    #     #    # #   ##    # ",r="\n  #       #     #    #       #     #  #  #  #      #       #     # #     #  #  #          #     #   #   #  # #   #",i="\n   #####  #     #    #       ######   #  ###       #       ####### ######   #   #####     #     #  #     # #  #  #",s="\n        # #     #    #       #        #  #  #      #       #     # #   #    #        #    #     #  ####### #   # #",t="\n  #     # #     #    #       #        #  #   #     #     # #     # #    #   #  #     #    #     #  #     # #    ##",i2="\n   #####   #####     #       #       ### #    #     #####  #     # #     # ###  #####     #    ### #     # #     # ";console.log(c+h+r+i+s+t+i2);
});
