((Campground, generateError, {cloudinary}) => {

    module.exports.index = async (req, res, next) => {
            const campground = await Campground.find({});
            if (!campground) throw new generateError(404, "No Data found")
            res.render("campgrounds/index",{campgrounds:campground})
    }
    
    module.exports.renderNewForm = (req, res) => {
            res.render("campgrounds/new");
    }
    
    module.exports.createCampground = async (req, res, next) => {
            if (!req.body.campgrounds) throw new generateError(400, "Missing/Invalid campgrounds Data.");         
            const camp = new Campground(req.body.campgrounds);
            camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
            camp.author = req.user._id;
            await camp.save();
            console.log(camp)
            req.flash("success", 'Successfully Added a new Campground!');
            res.redirect("/campgrounds");
    }
    
    module.exports.deleteCampground = async (req, res, next) => {
            const { id } = req.params;
            if (!id) throw new generateError(400, "Missing/Invalid ID.")
            await Campground.findByIdAndDelete(id);
            req.flash("success", 'Successfully Deleted the Campground!');
            res.redirect(`/campgrounds`)
    }
    
    module.exports.renderEditForm = async (req, res, next) => {
            const { id } = req.params;
            if (!id) throw new generateError(400, "Missing/Invalid ID.")
            const campground = await Campground.findById(id);
            if (!campground) 
                {   
                    req.flash('error',"Campground not Found!")
                    return res.redirect("/campgrounds")
                }    
            res.render("campgrounds/edit",{campground:campground});
    }
    
    module.exports.editCampground = async (req, res, next) => {
            const { id } = req.params;
            if (!id) throw new generateError(400, "Missing/Invalid ID.")
            const campground = await Campground.findByIdAndUpdate(id,{...req.body.campgrounds})
            if (!campground) 
            {   
                req.flash('error',"Campground not Found!")
                return res.redirect("/campgrounds")
            }           
            const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
            campground.images.push(...imgs);
            await campground.save()
            if(req.body.deleteImages)
            {
                for(let filename of req.body.deleteImages){
                    await cloudinary.uploader.destroy(filename)
                }
                await campground.updateOne({$pull: { images: { filename: {$in: req.body.deleteImages }}}})
            }
            req.flash("success", 'Successfully Updated the Campground!');
            res.redirect(`/campgrounds/${id}`);
    }
    
    module.exports.showCampground = async (req, res, next) => {
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
                req.flash('error',"Campground not Found!");
                return res.redirect("/campgrounds");
            }    
            res.render("campgrounds/show",{campground});
    }
})(
    require('../models/campground'),
    require('../utilities/generateError'),
    require('../cloudinary/index')
)