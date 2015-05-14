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
        failureFlash : true
    }), login.login);

    return router;
};