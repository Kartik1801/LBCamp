((mongoose,Schema) => {
    const CampgroundSchema = new mongoose.Schema({
        title: String,
        price: Number,
        image: String,
        description: String,
        location: String,
    })
    const Campground =  mongoose.model('Campground',CampgroundSchema)
    const camp = new Campground({
        title: "Fuji Park",
        description: "Reasonable Rates, Great View. Worth it All!!"
    })
    module.exports = Campground;
})(
    require("mongoose"),
    require("mongoose").Schema
)