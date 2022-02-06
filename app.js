((express, app, dotenv, path, mongoose, Campground, methodOverride, ejsMate, generateError, wrapAsync, joi, {campgroundSchema, reviewSchema}, Review, campgrounds) => {
    mongoose.connect("mongodb://localhost:27017/lb-camp",);
    mongoose.connection.on("error", console.error.bind(console, "Connection Error"))
    mongoose.connection.once("open", () => console.log("Database Connected"));
    app.engine('ejs', ejsMate);
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname,"views"));
    
    const validateReviews = (req, res, next) => {
        const {error} = reviewSchema.validate(req.body);
        if(error){
            const msg = error.details.map( el => el.message).join(', ');
            throw new generateError(400, msg);
        }
        else next();
    }
    // Middlewares:
    app.use(methodOverride("_method"));
    app.use(express.urlencoded({extended: true}));
    app.use('/campgrounds', campgrounds)
    
    // Home Route:
    app.get('/', (req, res) => {
        res.render("home")
    });

    

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
    require('joi'),
    require('./schemas'),
    require('./models/review'),
    require('./routes/campgrounds')
);