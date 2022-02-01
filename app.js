((express, app, dotenv, path, mongoose, Campground, methodOverride, ejsMate, generateError, wrapAsync, joi) => {

    mongoose.connect("mongodb://localhost:27017/lb-camp",);
    mongoose.connection.on("error", console.error.bind(console, "Connection Error"))
    mongoose.connection.once("open", () => console.log("Database Connected"));

    app.engine('ejs', ejsMate);
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname,"views"));
    
    // Using JOI to setup a schema for campgrounds:
    const campgroundSchema = joi.object({
        campground: joi.object({
            title: joi.string().required(),
            price: joi.number().required().min(0),
            image: joi.string().required(),
            description: joi.string().required(),
            location: joi.string().required()
        }).required()
    })

    // Middlewares:
    app.use(methodOverride("_method"));
    app.use(express.urlencoded({extended: true}));
    
    // Home Route:
    app.get('/', (req, res) => {
        res.render("home")
    });

    // Add a new Campground: 
    app.get('/campgrounds/new', (req, res) => {
        res.render("campgrounds/new");
    });
    app.post("/campgrounds", wrapAsync(async (req, res, next) => {
      /*  if (!req.body.campgrounds){
           throw new generateError(400, "Missing/Invalid campgrounds Data.")
       }     */
        const {error} = campgroundSchema.validate(req.body);
        if(error){
            const msg = error.details.message.map(el => el.message).join(",");
            throw new generateError(400, msg)
        }
        const camp = new Campground(req.body.campgrounds);
        await camp.save();
        res.redirect("/campgrounds");
    }));
    
    // Remove a Campground:
    app.delete("/campgrounds/:id", wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        if (!id){
            throw new generateError(400, "Missing/Invalid id.")
        }
        await Campground.findByIdAndRemove(id);
        res.redirect(`/campgrounds`)
    }));
    
    // Edit a Campground: 
    app.get('/campgrounds/:id/edit', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        if (!id){
            throw new generateError(400, "Missing/Invalid id.")
        }
        const campground = await Campground.findById(id);
        campground?res.render("campgrounds/edit",{campground:campground}):res.send("Invalid request");
    }));
    app.put("/campgrounds/:id", wrapAsync(async (req, res, next) => {
            const { id } = req.params;
            if (!id){
                throw new generateError(400, "Missing/Invalid id.")
            }
            await Campground.findByIdAndUpdate(id,req.body.campgrounds);
            res.redirect(`/campgrounds/${id}`)
    }));

    // Show Campground Details:
    app.get('/campgrounds/:id',wrapAsync(async (req, res, next) => {
            const {id} = req.params;
            if (!id){
                throw new generateError(400, "Missing/Invalid id.")
            }
            const campground = await Campground.findById(id)
            res.render("campgrounds/show",{campground})
    }));

    // Show All Campgrounds:
    app.get('/campgrounds',wrapAsync(async (req, res, next) => {
            const campground = await Campground.find({});
            if (!campground) {
                throw new generateError(404, "No Data found")
            }
            res.render("campgrounds/index",{campgrounds:campground})
    }));
    
    app.all("*", (req, res, next) => {
        next( new generateError(404, "Page Not Found!"))
    })

    // Error Handler Middleware
    app.use((err, req, res, next) => {
        const {status = 500} = err;
        if(!err.message) err.message = "Something went Wrong!"
        res.status(status).render("errors",{err});
    });

    app.listen(process.env.PORT,() => {
        console.log(`Listening on Port ${process.env.PORT}`);
    });
})
(
    require('express'),
    require('express')(), 
    require('dotenv').config(),
    require("path"),
    require('mongoose'),
    require('./models/campground'),
    require('method-override'),
    require('ejs-mate'),
    require('./utilities/generateError'),
    require('./utilities/wrapAsync'),
    require('joi')
);