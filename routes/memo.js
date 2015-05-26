/**
 * Created by fodrh on 2015. 3. 25..
 */
var express = require('express');
var router = express.Router();
var memo = require('../handlers/memo.js');

router.post('/', memo.create);
router.get('/', memo.read);
router.put('/', memo.update);
router.delete('/', memo.remove);

module.exports = router;