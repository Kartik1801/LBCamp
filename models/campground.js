((mongoose,Schema) => {
    const CampgroundSchema = new mongoose.Schema({
        title: String,
        price: Number,
        image: String,
        description: String,
        location: String,
    })
    const Campground =  mongoose.model('Campground',CampgroundSchema)
    module.exports = Campground;
})(
    require("mongoose"),
    require("mongoose").Schema
)