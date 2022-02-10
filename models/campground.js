((mongoose, Schema, Review) => {
    const CampgroundSchema = new Schema({
        title: String,
        price: Number,
        images: [
            {
                url: String,
                filename: String
            }
        ],
        description: String,
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        reviews: [
            {
                type: Schema.Types.ObjectId, 
                ref: "Review"
            }
        ]
    })
    CampgroundSchema.post('findOneAndDelete', async function (camp){
        if(camp){
            await Review.deleteMany({
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