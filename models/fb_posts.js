/**
 * Created by seb on 18-04-2017.
 */
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


// Seat Schema for creating seats
let Fb_postSchema = mongoose.Schema({
    posts_id: {
        type: Array
    },
    _id: {
        type: String
    }
});

let Fb_post = module.exports = mongoose.model('fb_posts', Fb_postSchema);
