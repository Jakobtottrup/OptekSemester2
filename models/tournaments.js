/**
 * Created by seb on 18-04-2017.
 */
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bcrypt = require('bcryptjs');

// Tournament Schema for creating tournaments
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