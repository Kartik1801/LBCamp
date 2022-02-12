((router, wrapAsync, {isLoggedIn, validateReviews, isReviewAuthor}, review) => {

    router.route('/')
        .get(review.redirectToCampground)
        .post(isLoggedIn, validateReviews, wrapAsync(review.createReview));
    
    router.route('/:review_id')
        .get(review.redirectToCampground)
        .delete(isLoggedIn, isReviewAuthor,wrapAsync(review.deleteReview));
    
    module.exports = router
})(
    require("express").Router({mergeParams: true}),
    require('../utilities/wrapAsync'),
    require('../middleware'),
    require('../controllers/reviews')
)