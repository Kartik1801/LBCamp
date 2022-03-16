const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const Review = require("./review");
const ImageSchema = new Schema({
            url: String,
            filename: String
})
// added a virtual function that returns url of an image with w_200 in its url 
// which is then used to obtain image of size 200px from cloudinary
ImageSchema.virtual('thumbnail').get(
    function() {return this.url.replace('/upload', '/upload/w_200')}
)
// By default when a mongoDB schema is JSON.stingified then it doesnt include virtual property
// so to include them we need to add option to our schema 
const options = { toJSON: { virtuals: true }}

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [
        ImageSchema
    ],
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: [{
            type: Number,
            required: true
        }]
    },
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
    }, 
    options 
);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
        return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description.substr(0,20)}...</p>`
    })   
CampgroundSchema.post('findOneAndDelete', async function (camp){
    if( camp ){ 
        await Review.deleteMany(
        {
            _id: {
                    $in: camp.reviews
                }
        })
    }
})
const Campground =  mongoose.model('Campground',CampgroundSchema)
module.exports = Campground;