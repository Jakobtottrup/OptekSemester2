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

// DATABASE CONNECTION
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://optek:optek123@ds153400.mlab.com:53400/heroku_fxdl0qct'); //url works properly - checked
var db = mongoose.connection;


var routes = require('./routes/frontend'); //main index (front page)
var users = require('./routes/users'); //user pages
var test = require('./routes/test'); //"testing directory" route
var admins = require('./routes/admins'); //admin-backend route


// Init App
var app = express();

app.use(session({ cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false}));


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Set Static Folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));



// Passport Init
app.use(passport.initialize());
app.use(passport.session());


//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
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



app.use('/', routes);
app.use('/users', users);
app.use('/test', test); //testing directory
app.use('/admins', admins);


//Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
   console.log('Server started on port '+app.get('port'));
});


// CONSOLE LOGS
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Database connection established!");
});
