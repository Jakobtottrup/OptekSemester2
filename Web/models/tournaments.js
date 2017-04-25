/**
 * Created by seb on 18-04-2017.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// Seat Schema for creating seats
var TournamentsSchema = mongoose.Schema({
    name: {
        type: String
    },
    beginTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    isOpen: {
        type: Boolean
    },
    isVisiable: {
        type: Boolean
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    prizes: {
        type: Array
    },
    max_teamsize: {
        type: Number
    },
    min_teamsize: {
        type: Number
    },
    max_teams: {
        type: Number
    },
    teams: {
        type: Array
    }
});

var Tournaments = module.exports = mongoose.model('tournaments', TournamentsSchema);
