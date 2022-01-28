((express, app, dotenv, path, mongoose, Campground) => {

    mongoose.connect("mongodb://localhost:27017/lb-camp",);
    mongoose.connection.on("error", console.error.bind(console, "Connection Error"))
    mongoose.connection.once("open", () => {
        console.log("Database Connected");
    });

    app.set("view engine", "ejs");
    app.set("views",path.join(__dirname,"views"));

    app.get('/', (req, res) => {
        res.render("home")
    });
    
    app.get('/campgrounds/:id',async (req, res) => {
       const {id} = req.params;
       const campground = await Campground.findById(id)
       res.render("campgrounds/show",{campground})
    });

    app.get('/campgrounds',async (req, res) => {
       const campground = await Campground.find({});
       res.render("campgrounds/index",{campgrounds:campground})
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
    require('./models/campground')
);