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
    app.get('/makecampground',async (req, res) => {
        const campground = new Campground({
            title: "My Backyard", 
            description: "Cheap Camping"
        })
        await campground.save()
        res.send(campground)
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