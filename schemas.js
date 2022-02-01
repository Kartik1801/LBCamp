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
})