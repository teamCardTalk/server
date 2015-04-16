fs = require('fs');
var UPLOAD_FOLDER = "./data";

exports.read = function(req, res) {

    var path = req.params.path;
    var where = req.query;
    var vpath = UPLOAD_FOLDER + "/" + path;
 
    console.log("path: " + path);

    res.sendfile(path,
        { root: './data'},
        function(err) {
            if (err) res.json(err);
        });
};