/**
 * Created by fodrh on 2015. 4. 10..
 */
var express = require('express'),
    router = express.Router(),
    card = require('../handlers/card.js');

var loginError = 1;

module.exports = function(passport) {
    router.post('/', isLoggedIn, card.create);
    router.get('/:getquery', isLoggedIn, card.read);
    router.put('/:putquery', isLoggedIn, card.update);
    router.delete('/:delquery', isLoggedIn, card.remove);

    //put del passport 형성 필요.

    return router;
};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        console.log('logged in');
        return next();
    }
    res.json({error:loginError});
}
