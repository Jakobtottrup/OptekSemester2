/**
 * Created by chris on 12-04-2017.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


// Group Schema for creating seatgroups
var GroupSchema = mongoose.Schema({
    groupName: {
        type: String,
        index:true
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
    creationDate: {
        type: Date
    }
});

var Group = module.exports = mongoose.model('seatgroup', GroupSchema);

module.exports.createGroup = function(newGroup, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newGroup.password, salt, function(err, hash) {
            newGroup.password = hash;
            newGroup.save(callback);
        });
    });
};