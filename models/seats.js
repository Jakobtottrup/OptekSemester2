/**
 * Created by seb on 18-04-2017.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// Seat Schema for creating seats
var SeatSchema = mongoose.Schema({
    container: {
        type: String
    }



/*
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
    },
    seatGroupID: {
        type: String
    }
*/



    /*
    roomWidth: {
        type: Number
    },
    roomHeight: {
        type: Number
    },
    roomStage: {
        type: Number
    },
    roomOpen: {
        type: Boolean
    },
    seats: {
        type: Array
    }*/
});

var seats = module.exports = mongoose.model('seats', SeatSchema);

