/**
 * Created by chris on 11-04-2017.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bcrypt = require('bcryptjs');


var UserSchema = mongoose.Schema({
        username: {
            type: String
        },
        age: {
            type: Number
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        studie: {
            type: String
        },
        bnet: {
            type: String
        },
        steam: {
            type: String
        },
        isAdmin: Boolean
    }
);

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};


// COMPARE LOGIN CREDENTIALS WITH USER IN DATABASE
module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
        console.log("Password match: "+isMatch);
    });
};


