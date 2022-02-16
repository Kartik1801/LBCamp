((express, app, path, mongoose, methodOverride, ejsMate, generateError, campgroundRoutes, reviewRoutes, session, flash, passport, passportLocal, User, userRoutes, expressMongoSanitize, helmet) => {
    if(process.env.NODE_ENV !== 'production'){
        require('dotenv').config()
    }
    // MAKE SURE TO ENCODE YOUR DB_URL IF YOUR CREDENTIALS CONTAINS SPECIAL CHARACTERS
    const dburl = process.env.DB_URL;
    mongoose.connect(dburl);
    mongoose.connection.on("error", console.error.bind(console, "Connection Error"))
    mongoose.connection.once("open", () => console.log("Database Connected"));
// Middlewares:
    app.engine('ejs', ejsMate);
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));    
    app.use(expressMongoSanitize())
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

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use( new passportLocal( User.authenticate()));
   
    passport.serializeUser( User.serializeUser());
    passport.deserializeUser( User.deserializeUser());

    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    });
// Routers:
    app.use('/campgrounds', campgroundRoutes);
    app.use('/campgrounds/:id/reviews', reviewRoutes);
    app.use('/', userRoutes)
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
    require("path"),
    require('mongoose'),
    require('method-override'),
    require('ejs-mate'),
    require('./utilities/generateError'),
    require('./routes/campgrounds'),
    require('./routes/reviews'),
    require('express-session'),
    require('connect-flash'),
    require('passport'),
    require('passport-local'),
    require('./models/user'),
    require('./routes/user'),
    require('express-mongo-sanitize'),
    require('helmet')
);