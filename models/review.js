const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})
const Review = mongoose.model('Review', reviewSchema)
module.exports = Review;