/**
 * Created by seb on 18-04-2017.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// Seat Schema for creating seats
var SeatSchema = mongoose.Schema({
    seatName: {
        type: String
    },
    seatState: {
        type: Number
    },
    seatOpen: {
        type: Boolean
    },
    seatUserID: {
        type: String
    }
    seatGroupID: {
        type: String
    }
});

var seats = module.exports = mongoose.model('seats', SeatSchema);

