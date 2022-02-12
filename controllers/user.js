((User) => {

    module.exports.redirectToRegister = (req, res) => {
            res.render("users/register");
    }
    
    module.exports.registerUser = async (req, res) => {
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
    }
    
    module.exports.redirectToLogin = (req, res) => {
            res.render("users/login");
    }
    
    module.exports.logUserIn = async (req, res) => {
            req.flash('success',"Welcome Back!")
            const redirect = req.session.returnTo || "/campgrounds";
            delete req.session.returnTo
            res.redirect(redirect);
    }
    
    module.exports.logUserOut = (req, res) => {
            req.logOut();
            req.flash("success", 'See You Again!');
            res.redirect("/campgrounds");
    }

})(
    require('../models/user')
)