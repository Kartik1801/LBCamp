const router = require("express").Router({mergeParams: true});
const wrapAsync = require('../utilities/wrapAsync');
const {isLoggedIn, validateReviews, isReviewAuthor} = require('../middleware');
const review = require('../controllers/reviews')

router.route('/')
    .get(review.redirectToCampground)
    .post(isLoggedIn, validateReviews, wrapAsync(review.createReview));
    
router.route('/:review_id')
    .get(review.redirectToCampground)
    .delete(isLoggedIn, isReviewAuthor,wrapAsync(review.deleteReview));
    
module.exports = router