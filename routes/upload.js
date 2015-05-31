/**
 * Created by fodrh on 2015. 4. 10..
 */
var express = require('express');
var router = express.Router();
var upload = require('../handlers/upload.js');
var loginError = 1;
router.post('/', isLoggedIn,upload.create);
router.get('/:uploadquery',isLoggedIn, upload.read);
//router.put('/', upload.update);
router.delete('/', isLoggedIn, upload.remove);

module.exports = router

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        console.log('logged in');
        return next();
    }
	res.json({error:loginError});
}
