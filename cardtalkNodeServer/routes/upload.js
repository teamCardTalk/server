/**
 * Created by fodrh on 2015. 4. 10..
 */
var express = require('express');
var router = express.Router();
var upload = require('../handlers/upload.js');

router.post('/', upload.create);
router.get('/:getquery', upload.read);
router.put('/:putquery', upload.update);
router.delete('/', upload.remove);

module.exports = router;