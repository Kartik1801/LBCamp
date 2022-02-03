((mongoose, Schema) => {
    const CampgroundSchema = new Schema({
        title: String,
        price: Number,
        image: String,
        description: String,
        location: String,
        reviews: [
            {
                type: Schema.Types.ObjectId, 
                ref: "Review"
            }
        ]
    })
    const Campground =  mongoose.model('Campground',CampgroundSchema)
    module.exports = Campground;
})(
    require("mongoose"),
    require("mongoose").Schema
)