((express, router, User, wrapAsync, passport) => {
    
    router.get('/register', (req, res) => {
        res.render("users/register");
    })
    router.post('/register',wrapAsync(async (req, res) => {
        try{
                const { user:userData } = req.body;
                const user = new User({username: userData.username, email: userData.email});
                const registeredUser = await User.register(user, userData.password);
            }
        catch(e){
                req.flash("error", e.message);
                return res.redirect("/register");
            }
        req.flash('success',"Welcome to LBCamp!")
        res.redirect("/campgrounds");
    }))

    router.get('/login', (req, res) => {
        res.render("users/login");
    })
    router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), wrapAsync(async (req, res) => {
        req.flash('success',"Welcome Back!")
        res.redirect("/campgrounds");
    }))

    module.exports = router;
})(
    require("express"),
    require("express").Router(),
    require("../models/user"),
    require('../utilities/wrapAsync'),
    require('passport')
)