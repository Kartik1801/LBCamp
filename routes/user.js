((router, wrapAsync, passport, user) => {
    
    router.get('/register', user.redirectToRegister)
    
    router.post('/register',wrapAsync(user.registerUser))

    router.get('/login', user.redirectToLogin)
    
    router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: "/login"}), wrapAsync(user.logUserIn))
    
    router.get('/logout', user.logUserOut)
    
    module.exports = router;
    
})(
    require("express").Router(),
    require('../utilities/wrapAsync'),
    require('passport'),
    require('../controllers/user')
)