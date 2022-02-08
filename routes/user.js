((express, router, User, wrapAsync, generateError) => {
    router.get('/register', (req, res) => {
        res.render("users/register");
    })
    router.post('/register',wrapAsync(async (req, res) => {
        res.send(req.body)
    }))
    module.exports = router;
})(
    require("express"),
    require("express").Router(),
    require("../models/user"),
    require('../utilities/wrapAsync'),
    require('../utilities/generateError')
)