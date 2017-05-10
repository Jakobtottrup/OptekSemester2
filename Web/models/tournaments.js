/**
 * Created by seb on 18-04-2017.
 */
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// Seat Schema for creating seats
let TournamentSchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    openingDate: {
        type: Date
    },
    closingDate: {
        type: Date
    },
    startDate: {
        type: Date
    },
    isVisibel: {
        type: Boolean
    },
    maxTeams: {
        type: Number
    },
    maxTeamSize: {
        type: Number
    },
    minTeamSize: {
        type: Number
    },
    teams: {
      type: Array
    },
    tourDuration: {
        type: Number
    },
     coverImage: {
        type: String
    },
    prizes: {
        type: Array
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
let Tournament = module.exports = mongoose.model('tournaments', TournamentSchema);



// PASSWORD ENCRYPTION
module.exports.createTeam = function(newTeam, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newTeam.password, salt, function(err, hash) {
            newTeam.password = hash;
            newTeam.save(callback);
        });
    });
};


module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);

    });
};
