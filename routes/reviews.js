((express, router, generateError, wrapAsync, joi, {reviewSchema}, mongoose, Campground, Review, campgroundsRouter) => {
    const validateReviews = (req, res, next) => {
        const {error} = reviewSchema.validate(req.body);
        if(error){
            const msg = error.details.map( el => el.message).join(', ');
            throw new generateError(400, msg);
        }
        else next();
    }
// Add Reviews:
    router.post("/", validateReviews, wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        console.log(req.params)
        if (!id) throw new generateError(400, "Missing/Invalid Id.")
        const campground = await Campground.findById(id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash("success", 'Successfully Created a Review!');
        res.redirect(`/campgrounds/${campground._id}`)
        }))
//  Delete Review: 
    router.delete("/:review_id", wrapAsync(async (req, res, next) => {
            const {id, review_id} = req.params;
            if (!id||!review_id) throw new generateError(400, "Missing/Invalid ID.")
            await Campground.findByIdAndUpdate(id, { $pull: {reviews: review_id}});
            await Review.findByIdAndDelete(review_id);
            req.flash("success", 'Successfully Deleted the Review!');
            res.redirect(`/campgrounds/${id}`);
        }))
    module.exports = router
})(
    require("express"),
    require("express").Router({mergeParams: true}),
    require('../utilities/generateError'),
    require('../utilities/wrapAsync'),
    require('joi'),
    require('../schemas'), 
    require('mongoose'),
    require('../models/campground'),
    require('../models/review'),
    require('./campgrounds')
)

