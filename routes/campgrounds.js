((express, router, generateError, wrapAsync, joi, {campgroundSchema}, mongoose,  Campground) => {
        const validateCampground = (req, res, next) => {
        const { error } = campgroundSchema.validate(req.body);
        if (error)
        {
            const msg = error.details.map( el => el.message).join(", ");
            throw new generateError(400, msg);
        }
        else next();
    }
// Add a new Campground: 
    router.get('/new', (req, res) => {
        res.render("campgrounds/new");
    });
    router.post("/", validateCampground, wrapAsync(async (req, res, next) => {
        if (!req.body.campgrounds) throw new generateError(400, "Missing/Invalid campgrounds Data.");         
        const camp = new Campground(req.body.campgrounds);
        await camp.save();
        req.flash("success", 'Successfully made a new Campground')
        res.redirect("/campgrounds");
    }));    
// Remove a Campground:
    router.delete("/:id", wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        if (!id) throw new generateError(400, "Missing/Invalid ID.")
        await Campground.findByIdAndDelete(id);
        res.redirect(`/campgrounds`)
    }));
// Edit a Campground: 
    router.get('/:id/edit', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        if (!id) throw new generateError(400, "Missing/Invalid ID.")
        const campground = await Campground.findById(id);
        campground?res.render("campgrounds/edit",{campground:campground}):res.send("Invalid request");
    }));
    router.put("/:id", validateCampground, wrapAsync(async (req, res, next) => {
            const { id } = req.params;
            if (!id) throw new generateError(400, "Missing/Invalid ID.")
            await Campground.findByIdAndUpdate(id,req.body.campgrounds);
            res.redirect(`/${id}`)
    }));
// Show Campground Details:
    router.get('/:id',wrapAsync(async (req, res, next) => {
            const {id} = req.params;
            if (!id) throw new generateError(400, "Missing/Invalid ID.")
            const campground = await Campground.findById(id).populate("reviews")
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
)