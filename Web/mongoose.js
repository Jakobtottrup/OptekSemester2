/**
 * Created by jakobtottrup on 07/04/2017.
 */


var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://optek:optek123@ds153400.mlab.com:53400/heroku_fxdl0qct');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected!");
});

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    studie: String,
    bnet: String,
    steam: String,
    hasPaid: Boolean,
    hasSeat: Boolean
});

// NOTE: methods must be added to the schema before compiling it with mongoose.model()
userSchema.methods.info = function () {
    var name = this.name
        ? "Name: " + this.name
        : "No name for user";

    var id = this._id
        ? "ID: " + this._id
        : "No ID found";

    var paymentStatus = this.hasPaid
        ? "Payment status: " + this.hasPaid
        : "Payment status: ";

    console.log(name + id + paymentStatus);

};


var users = mongoose.model('users', userSchema);


/*var jakob = new users({
    name: 'Jakob',
    email: 'jatoe13@student.sdu.dk',
    studie: 'Optek16',
    bnet: 'bnet#1234',
    steam: 'steamID1234',
    hasPaid: true,
    hasSeat: false
});

jakob.save(function (err, jakob) {
    if (err) return console.error(err);
    jakob.info();

});*/

var seb = new users({
    name: 'Sebastian',
    email: 'seand16@student.sdu.dk',
    studie: 'Optek16',
    bnet: 'bnet#2222',
    steam: 'steamID2222',
    hasPaid: true,
    hasSeat: true
});

/*
seb.save(function (err, seb) {
    if (err) return console.error(err);
    seb.info();

});
*/


users.find(function (err, users) {
    if (err) return console.error(err);
    console.log(users);
});





//user.find({ name: /^ja/ }, callback);
