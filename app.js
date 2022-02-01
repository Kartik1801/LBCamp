((express, app, dotenv, path, mongoose, Campground, methodOverride, ejsMate, generateError, wrapAsync) => {

    mongoose.connect("mongodb://localhost:27017/lb-camp",);
    mongoose.connection.on("error", console.error.bind(console, "Connection Error"))
    mongoose.connection.once("open", () => console.log("Database Connected"));

    app.engine('ejs', ejsMate);
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname,"views"));
    
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
        const camp = new Campground(req.body.campgrounds);
        await camp.save();
        res.redirect("/campgrounds");
    }));
    
    // Remove a Campground:
    app.delete("/campgrounds/:id", wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        await Campground.findByIdAndRemove(id);
        res.redirect(`/campgrounds`)
    }));
    
    // Edit a Campground: 
    app.get('/campgrounds/:id/edit', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        campground?res.render("campgrounds/edit",{campground:campground}):res.send("Invalid request");
    }));
    app.put("/campgrounds/:id", wrapAsync(
        async (req, res, next) => {
            const { id } = req.params;
            await Campground.findByIdAndUpdate(id,req.body.campgrounds);
            res.redirect(`/campgrounds/${id}`)
    }));

    // Show Campground Details:
    app.get('/campgrounds/:id',wrapAsync(
        async (req, res, next) => {
            const {id} = req.params;
            const campground = await Campground.findById(id)
            res.render("campgrounds/show",{campground})
    }));

    // Show All Campgrounds:
    app.get('/campgrounds',wrapAsync(
        async (req, res, next) => {
            const campground = await Campground.find({});
            res.render("campgrounds/index",{campgrounds:campground})
    }));
    
    // Error Handler Middleware
    app.use((err, req, res, next) => {
        const {status = 500, message = "Something went Wrong!"} = err;
        res.status(status).send(message);
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
    require('./utilities/wrapAsync')
);