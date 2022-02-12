((router, wrapAsync, passport, user) => {
    
    router.route('/register')
        .get(user.redirectToRegister)
        .post(wrapAsync(user.registerUser))

    router.route('/login')
        .get(user.redirectToLogin)
        .post(passport.authenticate('local', {failureFlash: true, failureRedirect: "/login"}), wrapAsync(user.logUserIn))
    
    router.get('/logout', user.logUserOut)
    
    module.exports = router;
    
})(
    require("express").Router(),
    require('../utilities/wrapAsync'),
    require('passport'),
    require('../controllers/user')
)