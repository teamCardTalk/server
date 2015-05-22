/**
 * Created by fodrh on 2015. 5. 10..
 */
var express = require('express');
var router = express.Router();
var login = require('../handlers/login.js');

router.post('/', login.login);
router.post('/signUp', login.signUp);
//router.get('/', login.read);
//router.put('/', login.update);
//router.delete('/', login.remove);


module.exports = router;
