((express, app, dotenv, path, mongoose, Campground, methodOverride) => {

    mongoose.connect("mongodb://localhost:27017/lb-camp",);
    mongoose.connection.on("error", console.error.bind(console, "Connection Error"))
    mongoose.connection.once("open", () => {
        console.log("Database Connected");
    });

    app.use(methodOverride("_method"));
    app.use(express.urlencoded({extended: true}));
    
    app.set("view engine", "ejs");
    app.set("views",path.join(__dirname,"views"));
    
    // home route
    app.get('/', (req, res) => {
        res.render("home")
    });
    
    // Add a new campground 
    app.get('/campgrounds/new',(req, res) => {
        res.render("campgrounds/new");
    })
    app.post("/campgrounds", async (req, res) => {
        const camp = new Campground(req.body.campgrounds);
        await camp.save();
        res.redirect("/campgrounds");
    })
    
    // Remove campground 
    app.delete("/campgrounds/:id", async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndRemove(id,req.body.campgrounds);
        res.redirect(`/campgrounds`)
    })
    
    // Edit campground 
    app.get('/campgrounds/:id/edit', async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        campground?res.render("campgrounds/edit",{campground:campground}):res.send("Invalid request");
    })
    app.put("/campgrounds/:id", async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndUpdate(id,req.body.campgrounds);
        res.redirect(`/campgrounds/${id}`)
    })

    // show campground details
    app.get('/campgrounds/:id',async (req, res) => {
       const {id} = req.params;
       const campground = await Campground.findById(id)
       res.render("campgrounds/show",{campground})
    });

    // show All campgrounds
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
    require('./models/campground'),
    require('method-override')
);