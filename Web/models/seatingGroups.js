/**
 * Created by chris on 12-04-2017.
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');


// Group Schema for creating seating groups
var GroupSchema = mongoose.Schema({
    groupName: {
        type: String
    },
    password: {
        type: String
    },
    members: {
        type: Array
    },
    leaderID: {
        type: String
    },
    eventID: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var Group = module.exports = mongoose.model('seatgroup', GroupSchema);


// PASSWORD ENCRYPTION
module.exports.createGroup = function(newGroup, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newGroup.password, salt, function(err, hash) {
            newGroup.password = hash;
            newGroup.save(callback);
        });
    });
};


module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
        //console.log("Password match: " + isMatch);
    });
};
