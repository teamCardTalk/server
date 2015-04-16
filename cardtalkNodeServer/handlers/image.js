fs = require('fs');
var UPLOAD_FOLDER = "./data";

exports.read = function(req, res) {

    var path = req.params.path;
    var where = req.query;
    var vpath = UPLOAD_FOLDER + "/" + path;
 
    console.log("path: " + path);
    
    fs.readFile(vpath, function(err, data) {

        if (err) {
            res.writeHead(404, {
                'content-type': 'text/plain'
            });
            res.end('404');
        }

        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        res.end(data, 'binary');
    });  
};