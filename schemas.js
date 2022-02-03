const joi = require('joi')
// Using JOI to setup a schema for campgrounds:
module.exports.campgroundSchema = joi.object({
    campgrounds: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required()
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    }).required()
})