/**
 * Created by eunjoo on 2015. 5. 26..
 */
var express = require('express');
var router = express.Router();
var friend = require('../handlers/friend.js');
var loginError = 1;

router.post('/:userid', isLoggedIn, friend.add);
router.delete('/:userid', isLoggedIn, friend.remove);
router.get('/', isLoggedIn, friend.read);
router.get('/:userid', isLoggedIn, friend.readdetail);

module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        console.log('logged in');
        return next();
    }
	res.json({error:loginError});
}
