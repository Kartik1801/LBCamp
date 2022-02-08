module.exports.isLoggedIn = (req, res, next) => {
        if(!req.isAuthenticated()){
            console.log(req.path, req.originalUrl)
            req.session.returnTo = req.originalUrl;
            req.flash('error',"You must be logged in!");
            return res.redirect("/login")
        }
        return next();
    }