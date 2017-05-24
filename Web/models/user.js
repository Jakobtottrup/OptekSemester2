var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
        username: {
            type: String,
            required: true},
        age: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: Number
        },
        studie: {
            type: String,
            required: true
        },
        fakultet: {
            type: String,
            required: true
        },
        bnet: {
            type: String
        },
        steam: {
            type: String
        },
        createdAt: {
            type: Date
        },
        isAdmin: Boolean,
        hasPaid: Boolean,
        isActive: Boolean
    }
);
var User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};
// COMPARE LOGIN CREDENTIALS WITH USER IN DATABASE
module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};
module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserByEmail = function (email, callback) {
    var query = {email: email};
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};



