var fs = require('fs'),
	querystring = require('querystring');

exports.read = function(req, res) {

    var path = req.params.path;

    var photo = querystring.parse(path)['photo'];
    var icon = querystring.parse(path)['icon'];

    console.log("path: " + path);

    if (typeof photo !== 'undefined') {
    	console.log(photo);
        res.sendFile(photo,
	        { root: '../data'},
	        function(err) {
	            if (err) res.json(err);
	        });
    } else if (typeof icon !== 'undefined') {
        res.sendFile(icon,
	        { root: '../icon'},
	        function(err) {
	            if (err) res.json(err);
	        });
    }
};
