((express, app, dotenv, path, mongoose, methodOverride, ejsMate, generateError, campgrounds, reviews, session, flash) => {
    mongoose.connect("mongodb://localhost:27017/lb-camp",);
    mongoose.connection.on("error", console.error.bind(console, "Connection Error"))
    mongoose.connection.once("open", () => console.log("Database Connected"));
// Middlewares:
    app.engine('ejs', ejsMate);
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));    
    app.use(methodOverride("_method"));
    app.use(express.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, "public")));
    const sessionConfig = {
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        cookie:{
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }
    app.use(session(sessionConfig));
    app.use(flash());

    app.use((req, res, next) => {
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    });
// Routers:
    app.use('/campgrounds', campgrounds);
    app.use('/campgrounds/:id/reviews', reviews);
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
    require('method-override'),
    require('ejs-mate'),
    require('./utilities/generateError'),
    require('./routes/campgrounds'),
    require('./routes/reviews'),
    require('express-session'),
    require('connect-flash')
);