((router, wrapAsync,  {isLoggedIn, isAuthor, validateCampground}, campground, multer, cloudinary) => {
    
    const cl = new cloudinary.Cloudinary({cloud_name: "dgj3fg9in", secure: true});
    const upload = multer({ dest: "uploads/"});
    router.route('/')
        .get(wrapAsync(campground.index))
      /*   .post(isLoggedIn, validateCampground, wrapAsync(campground.createCampground)); */
        .post( upload.array('image'), (req, res) => {
            console.log(req.body, req.files);
            res.send("OK")
        })

    router.get('/new', isLoggedIn, campground.renderNewForm);
    router.route('/:id')
        .get(wrapAsync(campground.showCampground))
        .put(isLoggedIn, isAuthor, validateCampground, wrapAsync(campground.editCampground))
        .delete(isLoggedIn, isAuthor, wrapAsync(campground.deleteCampground));
        
    router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campground.renderEditForm));
    
    module.exports = router;
    
})(
    require("express").Router(),
    require('../utilities/wrapAsync'),
    require('../middleware'),
    require('../controllers/campgrounds'),
    require('multer'),
    require('cloudinary')
)