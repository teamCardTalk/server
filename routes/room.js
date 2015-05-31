/**
 * Created by fodrh on 2015. 5. 10..
 */
var express = require('express');
var router = express.Router();
var room = require('../handlers/room.js');

var loginError = 1;
router.get('/join/:articleid', isLoggedIn, room.join);
router.get('/out/:articleid', isLoggedIn, room.out);
router.get('/list/:articleid', isLoggedIn, room.list);
//router.post('/', room.create);
//router.post('/', room.create);
//router.get('/', room.read);
//router.put('/', room.update);
//router.delete('/', room.remove);

module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        console.log('logged in');
        return next();
    }
	res.json({error:loginError});
}
