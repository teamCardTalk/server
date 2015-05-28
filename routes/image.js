var express = require('express');
var router = express.Router();
var image = require('../handlers/image.js');

router.get('/:path',isLoggedIn, image.read);

module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        console.log('logged in');
        return next();
    }
    var host = req.get('host');
    res.redirect(host + '/login');
}