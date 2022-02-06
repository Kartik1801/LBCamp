((express, router, generateError, wrapAsync, joi, {routerSchema}, mongoose, Campground, Review, campgroundsRouter) => {
    const validateReviews = (req, res, next) => {
        const {error} = reviewSchema.validate(req.body);
        if(error){
            const msg = error.details.map( el => el.message).join(', ');
            throw new generateError(400, msg);
        }
        else next();
    }
// Add Reviews:
    app.post("/campgrounds/:id/reviews", validateReviews, wrapAsync(async (req, res, next) => {
        const {id} = req.params;
        if (!id) throw new generateError(400, "Missing/Invalid Id.")
        const campground = await Campground.findById(id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
        }))
//  Delete Review: 
    app.delete("/campgrounds/:camp_id/reviews/:review_id", wrapAsync(async (req, res, next) => {
            const {camp_id, review_id} = req.params;
            if (!camp_id||!review_id) throw new generateError(400, "Missing/Invalid ID.")
            await Campground.findByIdAndUpdate(camp_id, { $pull: {reviews: review_id}});
            await Review.findByIdAndDelete(review_id);
            res.redirect(`/campgrounds/${camp_id}`);
        }))
})(
    require("express"),
    require("express").Router(),
    require('../utilities/generateError'),
    require('../utilities/wrapAsync'),
    require('joi'),
    require('../schemas'), 
    require('mongoose'),
    require('../models/campground'),
    require('../models/review'),
    require('./campgrounds')
)

