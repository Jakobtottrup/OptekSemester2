/**
 * Created by chris on 12-04-2017.
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');


// Group Schema for creating seating groups
let GroupSchema = mongoose.Schema({
    group_name: {
        type: String
    },
    password: {
        type: String
    },
    members: {
        type: Array
    },
    leader_id: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
    }
});

let Group = module.exports = mongoose.model('seatgroup', GroupSchema);


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
    });
};
