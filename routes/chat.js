/**
 * Created by fodrh on 2015. 3. 25..
 */
var express = require('express');
var router = express.Router();
var chat = require('../handlers/chat.js');

router.post('/', isLoggedIn, chat.create);
router.get('/:getquery', isLoggedIn, chat.read);

module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        console.log('logged in');
        return next();
    }
    var host = req.get('host');
    res.redirect(host + '/login');
}