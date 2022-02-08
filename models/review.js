((mongoose, Schema) => {
    const reviewSchema = new Schema({
        body: String,
        rating: Number
    })
    const Review =  mongoose.model('Review', reviewSchema)
    module.exports = Review;
})(
    require("mongoose"),
    require("mongoose").Schema
)