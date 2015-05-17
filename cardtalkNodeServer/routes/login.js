/**
 * Created by fodrh on 2015. 5. 10..
 */
var express = require('express');
var router = express.Router();
var login = require('../handlers/login.js');


module.exports = function(passport) {
    router.post('/signup', passport.authenticate('signup', {
        failureFlash : true
    }), login.signUp);

    router.post('/', passport.authenticate('login', {
        failureFlash : true,
        failureRedirect : '/login',
        successRedirect : '/login/profile'
    }), login.login);

    router.get('/', login.getLogin);
    router.get('/profile', isLoggedIn, function(req, res) {
        //res.send(JSON.stringify(req.user));
        res.end(JSON.stringify(req.session));
    });

    return router;
};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        console.log('logged in');
        return next();
    }

    res.end('nonononono');
}

