((Campground, Review, generateError) => {

    module.exports.redirectToCampground = (req, res) => {
            res.redirect(`/campgrounds/${req.params.id}`)
    }

    module.exports.createReview = async (req, res, next) => {
            const { id } = req.params;
            if (!id) throw new generateError(400, "Missing/Invalid Id.")
            const campground = await Campground.findById(id);
            const review = new Review(req.body.review);
            campground.reviews.push(review);
            review.author = req.user.id;
            await review.save();
            await campground.save();
            req.flash("success", 'Successfully Created a Review!');
            res.redirect(`/campgrounds/${campground._id}`)
    }
    
    module.exports.deleteReview = async (req, res, next) => {
            const {id, review_id} = req.params;
            if (!id || !review_id) throw new generateError(400, "Missing/Invalid ID.")
            await Campground.findByIdAndUpdate(id, { $pull: {reviews: review_id}});
            await Review.findByIdAndDelete(review_id);
            req.flash("success", 'Successfully Deleted the Review!');
            res.redirect(`/campgrounds/${id}`);
    }

})(
    require('../models/campground'),
    require('../models/review'),
    require('../utilities/generateError')
)