/**
 * Created by seb on 18-04-2017.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// Seat Schema for creating seats
var EventSchema = mongoose.Schema({
    name: {
        type: String
    },
    beginTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    place: {
        description: {
            type: String
        },
        coordinates: {
            type: String
        }
    },
    price: {
        type: Number
    },
    isOpen: {
        type: Boolean
    },
    isActive: {
        type: Boolean
    },
    maxUsers: {
        type: Number
    }

});

var Event = module.exports = mongoose.model('Event', EventSchema);
