// Init Modules
var path = require('path');
var express = require('express');
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


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Set Static Folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));


// Express Session
app.use(expressSession({
    secret : 'secret',
    saveUninitialized: true,
    resave: true
}));


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






//UNUSED FILE
//UNUSED FILE
//UNUSED FILE






//var MongoClient = require('mongodb').MongoClient
//    , assert = require('assert');
//    , assert = require('assert');
//// Connection URL
//var url = 'mongodb://localhost:27017/s7lan-users';
//var input = "Test";
//// Use connect method to connect to the server
////MongoClient.connect(url, function (err, db) {
//    assert.equal(null, err);
//    console.log("Connected successfully to server");
//    //db.createCollection("Users");
//    //updateDocument(db, function() {});
//    removeDocument(db, function () {});
//    //insertDocuments(db, function () {});
//    //insertDocuments(db, function () {});
//    //insertDocument(db, function () {}); <-- not working
//    findDocuments(db, function () {});
//    findDocuments(db, function () {});
//    db.close();
//    db.close();
//});
///!*var insertDocument = function (db, callback) {
//    var collection = db.collection('documents');
//    collection.insertOne([{
//        Name: 'Jakob',
//        Email: 'Jatoe13@student.sdu.dk',
//        Studie: 'Optek16',
//        Battletag: 'btag#1234',
//        SteamID: 'steam1234',
//        hasPaid: false,
//        Winratio: 1.9
//    }], function (err, result) {
//        assert.equal(err, null);
//        assert.equal(3, result.result.n);
//        assert.equal(3, result.ops.length);
//        console.log("Inserted 3 documents into the collection");
//        callback(result);
//    })
//};*!/
//var insertDocuments = function (db, callback) {
//    // Get the documents collection
//    var collection = db.collection('Users');
//    // Insert some documents
//    collection.insertMany([
//        {
//            Name: 'Sebastian',
//            Email: 'seand16@student.sdu.dk',
//            Studie: 'Optek16',
//            Battletag: 'btag#2222',
//            SteamID: 'steam2222'
//            hasPaid: true,
//            Winratio: 1.2
//        }, {
//            Name: 'Christian',
//            Email: 'cskje16@student.sdu.dk',
//            Studie: 'Optek16',
//            Battletag: 'btag#3333',
//            SteamID: 'steam3333',
//            hasPaid: false,
//            Winratio: 1.8
//        }, {
//            Name: 'Jim',
//            Email: 'jiped16@student.sdu.dk',
//            Studie: 'Optek16',
//            Battletag: 'btag#4444',
//            SteamID: 'steam4444',
//            hasPaid: true,
//            Winratio: 1.6
//        }
//    ], function (err, result) {
//        assert.equal(err, null);
//        assert.equal(3, result.result.n);
//        assert.equal(3, result.ops.length);
//        console.log("Inserted 3 documents into the collection");
//        callback(result);
//    });
//};
//};
//var updateDocument = function (db, callback) {
//    // Get the documents collection
//    var collection = db.collection('Users');
//    // Update document where a is 2, set b equal to 1
//    collection.updateOne({age: 26}
//        , {$set: {age: 250}}, function (err, result) {
//            assert.equal(err, null);
//            assert.equal(1, result.result.n);
//            console.log("Updated the document with the field a equal to 250");
//            callback(result);
//        });
//};
//};
//};
//var findDocuments = function (db, callback) {
//    // Get the documents collection
//    var collection = db.collection('Users');
//    // Find some documents
//    collection.find({}).toArray(function (err, docs) {
//        assert.equal(err, null);
//        console.log("Found the following records");
//        console.log(docs)
//        callback(docs);
//    });
//};
//};
//var removeDocument = function (db, callback) {
//    // Get the documents collection
//    var collection = db.collection('Users');
//    // Delete document where a is 3
//    collection.deleteOne({Age: 26}/!*, {input: 2}, {input: 3}*!/, function (err, result) {
//        assert.equal(err, null);
//        assert.equal(1, result.result.n);
//        console.log("Removed the document with the key a equal to input");
//        callback(result);
//    });
//    /!*collection.deleteMany({a: 3}, function (err, result) {
//     assert.equal(err, null);
//     assert.equal(12, result.result.n);
//     console.log("Removed all documents with field a equal to 1");
//     callback(result);
//     });*!/
//};
