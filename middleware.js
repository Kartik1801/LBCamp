const generateError = require('./utilities/generateError')
const {campgroundSchema, reviewSchema} = require('./schemas')
const Campground = require('./models/campground')
const Review = require('./models/review')
module.exports.isLoggedIn = (req, res, next) => {
        if(!req.isAuthenticated()){
            req.session.returnTo = req.originalUrl;
            req.flash('error',"You must be logged in!");
            return res.redirect("/login")
        }
        return next();
    }
module.exports.validateCampground = (req, res, next) => {
        const { error } = campgroundSchema.validate(req.body);
        if (error)
        {
            const msg = error.details.map( el => el.message).join(", ");
            throw new generateError(400, msg);
        }
        else next();
    }
module.exports.isAuthor = async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if(!campground.author._id.equals(req.user.id)){
            req.flash('error',"You dont have permission to edit!")
            return res.redirect(`/campgrounds/${ id }`)
        }
        return next();    
    }
module.exports.isReviewAuthor = async (req, res, next) => {
        const { review_id, id } = req.params;
        const review = await Review.findById(review_id);
        if(!review.author._id.equals(req.user.id)){
            req.flash('error',"You dont have permission to edit!")
            return res.redirect(`/campgrounds/${ id }`)
        }
        return next();    
    }
module.exports.validateReviews = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map( el => el.message).join(', ');
        throw new generateError(400, msg);
    }
    else next();
}
