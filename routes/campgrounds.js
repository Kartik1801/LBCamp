const router = require("express").Router()
const wrapAsync = require('../utilities/wrapAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const  campground = require('../controllers/campgrounds');
const multer = require('multer');
const {cloudinary, storage} = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campground.createCampground));

router.get('/new', isLoggedIn, campground.renderNewForm);

router.route('/:id')
    .get(wrapAsync(campground.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campground.editCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(campground.deleteCampground));    

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campground.renderEditForm));

module.exports = router;