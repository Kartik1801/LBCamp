((express, router, generateError, wrapAsync, joi, {campgroundSchema}, mongoose,  Campground, {isLoggedIn, isAuthor, validateCampground}) => {
// Add a new Campground: 
    router.get('/new', isLoggedIn, (req, res) => {
        res.render("campgrounds/new");
    });
    router.post("/", isLoggedIn, validateCampground, wrapAsync(async (req, res, next) => {
        if (!req.body.campgrounds) throw new generateError(400, "Missing/Invalid campgrounds Data.");         
        const camp = new Campground(req.body.campgrounds);
        camp.author = req.user._id;
        await camp.save();
        req.flash("success", 'Successfully Added a new Campground!');
        res.redirect("/campgrounds");
    }));    
// Remove a Campground:
    router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        if (!id) throw new generateError(400, "Missing/Invalid ID.")
        await Campground.findByIdAndDelete(id);
        req.flash("success", 'Successfully Deleted the Campground!');
        res.redirect(`/campgrounds`)
    }));
// Edit a Campground: 
    router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        if (!id) throw new generateError(400, "Missing/Invalid ID.")
        const campground = await Campground.findById(id);
        if (!campground) 
            {   
                req.flash('error',"Campground not Found!")
                return res.redirect("/campgrounds")
            }    
        res.render("campgrounds/edit",{campground:campground});
    }));
    router.put("/:id", isLoggedIn, isAuthor, validateCampground, wrapAsync(async (req, res, next) => {
            const { id } = req.params;
            if (!id) throw new generateError(400, "Missing/Invalid ID.")
            const campground = await Campground.findByIdAndUpdate(id,{...req.body.campgrounds})
            if (!campground) 
            {   
                req.flash('error',"Campground not Found!")
                return res.redirect("/campgrounds")
            }           
            req.flash("success", 'Successfully Updated the Campground!');
            res.redirect(`/campgrounds/${id}`)
    }));
// Show Campground Details:
    router.get('/:id', wrapAsync(async (req, res, next) => {
            const {id} = req.params;
            if (!id) throw new generateError(400, "Missing/Invalid ID.")
            const campground = await Campground.findById(id).populate({
                 path:"reviews",
                 populate: { 
                     path: "author"
                    }
                }).populate('author','username email');
            if (!campground) 
            {   
                req.flash('error',"Campground not Found!")
                return res.redirect("/campgrounds")
            }    
            res.render("campgrounds/show",{campground})
    }));
// Show All Campgrounds:
    router.get('/',wrapAsync(async (req, res, next) => {
            const campground = await Campground.find({});
            if (!campground) throw new generateError(404, "No Data found")
            res.render("campgrounds/index",{campgrounds:campground})
    }));
    module.exports = router;
})(
    require("express"),
    require("express").Router(),
    require('../utilities/generateError'),
    require('../utilities/wrapAsync'),
    require('joi'),
    require('../schemas'), 
    require('mongoose'),
    require('../models/campground'),
    require('../middleware')
)