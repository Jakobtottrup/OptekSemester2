/**
 * Created by seb on 18-04-2017.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// Seat Schema for creating seats
var SponsorSchema = mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    link: {
        type: String
    },
    seatUserID: {
        type: String
    }
});

var Sponsors = module.exports = mongoose.model('sponsors', SponsorSchema);
