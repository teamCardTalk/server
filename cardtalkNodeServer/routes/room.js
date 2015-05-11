/**
 * Created by fodrh on 2015. 5. 10..
 */
var express = require('express');
var router = express.Router();
var room = require('../handlers/room.js');


router.post('/join', room.join);
//router.post('/', room.create);
//router.post('/', room.create);
//router.get('/', room.read);
//router.put('/', room.update);
//router.delete('/', room.remove);

module.exports = router;