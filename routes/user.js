const router = require("express").Router();
const wrapAsync = require('../utilities/wrapAsync');
const passport = require('passport');
const user = require('../controllers/user');
    
router.route('/register')
    .get(user.redirectToRegister)
    .post(wrapAsync(user.registerUser))

router.route('/login')
    .get(user.redirectToLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: "/login"}), wrapAsync(user.logUserIn))
    
router.get('/logout', user.logUserOut)
    
module.exports = router;
    