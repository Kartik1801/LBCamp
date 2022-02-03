((mongoose, Schema, Review) => {
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

    CampgroundSchema.post('findOneAndDelete', async function (camp){
        if(camp){
            await Review.remove({
                _id: {
                    $in: camp.reviews
                }
            })
        }
    })

    const Campground =  mongoose.model('Campground',CampgroundSchema)
    module.exports = Campground;
})(
    require("mongoose"),
    require("mongoose").Schema,
    require("./review")
)