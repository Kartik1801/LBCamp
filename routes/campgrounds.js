((router, wrapAsync,  {isLoggedIn, isAuthor, validateCampground}, campground ) => {
    
    router.get('/',wrapAsync(campground.index));

    router.get('/new', isLoggedIn, campground.renderNewForm);

    router.post('/', isLoggedIn, validateCampground, wrapAsync(campground.createCampground));    
    
    router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campground.renderEditForm));
    
    router.get('/:id', wrapAsync(campground.showCampground));
    
    router.put('/:id', isLoggedIn, isAuthor, validateCampground, wrapAsync(campground.editCampground));
    
    router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(campground.deleteCampground));
    
    module.exports = router;
    
})(
    require("express").Router(),
    require('../utilities/wrapAsync'),
    require('../middleware'),
    require('../controllers/campgrounds')
)