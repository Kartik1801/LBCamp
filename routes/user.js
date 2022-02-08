((express, router, User, wrapAsync, passport) => {
    
    router.get('/register', (req, res) => {
        res.render("users/register");
    })
    router.post('/register',wrapAsync(async (req, res) => {
        try{
                const { user:userData } = req.body;
                const user = new User({username: userData.username, email: userData.email});
                const registeredUser = await User.register(user, userData.password);
                req.login(registeredUser, err => {
                    if (err) return next(err);
                    req.flash('success',"Welcome to LBCamp!")
                    res.redirect("/campgrounds");
                });
            }
        catch(e){
                req.flash("error", e.message);
                return res.redirect("/register");
            }
    }))

    router.get('/login', (req, res) => {
        res.render("users/login");
    })
    router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), wrapAsync(async (req, res) => {
        req.flash('success',"Welcome Back!")
        const redirect = req.session.returnTo || "/campgrounds";
        delete req.session.returnTo
        res.redirect(redirect);
    }))
    router.get('/logout', (req, res) => {
        req.logOut();
        req.flash("success", 'See You Again!');
        res.redirect("/campgrounds");
    })
    module.exports = router;
})(
    require("express"),
    require("express").Router(),
    require("../models/user"),
    require('../utilities/wrapAsync'),
    require('passport')
)