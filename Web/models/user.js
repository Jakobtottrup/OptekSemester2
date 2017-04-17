/**
 * Created by chris on 11-04-2017.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bcrypt = require('bcryptjs');




// COMPARE LOGIN CREDENTIALS WITH USER IN DATABASE
module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
        console.log(isMatch);
    });
};


