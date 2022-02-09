((router, wrapAsync, {isLoggedIn, validateReviews, isReviewAuthor}, review) => {

    router.get('/', review.redirectToCampground)
    
    router.post("/", isLoggedIn, validateReviews, wrapAsync(review.createReview))
    
    router.get('/:review_id', review.redirectToCampground)

    router.delete("/:review_id", isLoggedIn, isReviewAuthor,wrapAsync(review.deleteReview))
    
    module.exports = router
})(
    require("express").Router({mergeParams: true}),
    require('../utilities/wrapAsync'),
    require('../middleware'),
    require('../controllers/reviews')
)