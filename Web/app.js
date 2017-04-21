// console.log(" ____      _      .  .    ___     ___         __       .    .    ___      ___     ___ \n     |    / \\     | /    /   \\   |   \\       |  \\      |\\   |   /   \\    /   \\   |   \\ \n     |   /___\\    |/    |     |  |___/       |__/      | \\  |  |     |  |     |  |___/\n     |  /     \\   |\\    |     |  |   \\       | \\       |  \\ |  |     |  |     |  |   \\ \n\\___/  /       \\  | \\    \\___/   |___/       |  \\      |   \\|   \\___/    \\___/   |___/");console.log(" ____      _      .  .    ___     ___         __       .    .    ___      ___     ___ \n     |    / \\     | /    /   \\   |   \\       |  \\      |\\   |   /   \\    /   \\   |   \\ \n     |   /___\\    |/    |     |  |___/       |__/      | \\  |  |     |  |     |  |___/\n     |  /     \\   |\\    |     |  |   \\       | \\       |  \\ |  |     |  |     |  |   \\ \n\\___/  /       \\  | \\    \\___/   |___/       |  \\      |   \\|   \\___/    \\___/   |___/");
console.log(">> R E M E M B E R   T O   U P D A T E   M O D U L E S << \n -> npm install\n -> bower install \n");

// Init Modules
var path = require('path');
var express = require('express');
var session = require('express-session');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
mailer = require('express-mailer');

// DATABASE CONNECTION
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://optek:optek123@ds153400.mlab.com:53400/heroku_fxdl0qct'); //url works properly - checked
var db = mongoose.connection;


var routes = require('./routes/frontend'); //main index (front page)
var users = require('./routes/users'); //user pages
var admins = require('./routes/admins'); //admin-backend route


// Init App
var app = express();

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

/*
 var exphbs = exphbs.create({
 // Specify helpers which are only registered on this instance.
 helpers: {
 toUpperCase: function(value) {
 if (object) {
 return new exphbs.SafeString(value.toUpperCase());
 } else {
 return '';
 }
 }
 }
 });
 */


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
    next();
});


// PUBLIC ROUTES
app.use('/', routes);
app.use('/users', users);
app.use('/admins', admins);
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