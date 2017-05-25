/**
 * Created by seb on 18-04-2017.
 */
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// Seat Schema for creating seats
let EventSchema = mongoose.Schema({
    eventTime: {
        type: Date
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    maxGuests: {
        type: Number
    },
    location: {
        type: String
    },
    _id: {
        type: String
    }
});

let Event = module.exports = mongoose.model('Event', EventSchema);
