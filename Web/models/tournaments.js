/**
 * Created by seb on 18-04-2017.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// Seat Schema for creating seats
var TournamentSchema = mongoose.Schema({
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
var Tournament = module.exports = mongoose.model('tournament', TournamentSchema);
