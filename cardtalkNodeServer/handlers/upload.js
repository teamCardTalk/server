/**
 * Created by fodrh on 2015. 4. 10..
 */
var formidable = require('formidable'),
    util = require('util'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs'),
    querystring = require('querystring');

//var UPLOAD_FOLDER = __dirname + "/data";
var UPLOAD_FOLDER = "./data";

exports.create = function (req, res) {
    var form = new formidable.IncomingForm(),
        files = [],
        fields = [],
        newCard = {},
        result;

    form.uploadDir = UPLOAD_FOLDER;
    form.keepExtensions = true;
    form.multiple = "multiple";

    form.on ('field', function(field, value) {
        console.log(field, value);
        fields.push([field, value]);
    }).on ('file', function (field, file) {
        console.log(field, file);
        files.push([field, file]);
        console.log("files!!!! --- " + JSON.stringify(files));
    }).on ('progress', function(bytesReceived, bytesExpected) {
        console.log('progress: ' + bytesReceived + '/' + bytesExpected);
    }).on ('end', function() {
        console.log('-> upload done');

        console.log('parse - ' + JSON.stringify(files));

        result = files;
        var fileInfos = [];

        for (var file in files) {
            var path = files[file][1]['path'],
                index = path.lastIndexOf('/') + 1,
                _id = path.substr(index);

            var fileInfo = {
                path: path,
                name: files[file][1]['name']
            };

            result[file]["_id"] = _id;
            console.log("fileinfos: " + JSON.stringify(fileInfo));
            fileInfos.push(fileInfo);
        }

        newCard.file = fileInfos;

        console.log('newCard - ' + JSON.stringify(newCard));
    });

    form.parse(req, function(err, fields, files) {
        newCard.author = fields["author"];
        newCard.memo = fields["memo"];
        newCard.date = new Date();

        _insertMemo(req, newCard, function (error, results) {
            result["error"] = error;
            result["results"] = results;
            res.end(JSON.stringify(newCard));
        });
    });
};

exports.read = function(req, res) {

    var getquery = req.params.getquery;
    var _id = querystring.parse(getquery)['_id'];
    var where = req.query;


    if (typeof _id !== 'undefined') {
        var ObjectID = require('mongodb').ObjectID;
        var objid = new ObjectID(_id);
        where = {_id: objid};
    }

    console.log("where: " + JSON.stringify(where));
    _findMemo(req, where || {}, function (err, results) {
        res.json({error: err, results: results});
    });
};

exports.update = function(req, res) {
    var getquery = req.params.getquery;
    var _id = querystring.parse(getquery)['_id'];
    var where = {};
    var body = req.body;

    if (typeof _id !== 'undefined') {
        var ObjectID = require('mongodb').ObjectID;
        var objid = new ObjectID(_id);
        where = {_id: objid};
    }

    _updateMemo(req, where, body, function(error, results) {
        res.json( {error: error, results : results});
    });
};

exports.remove = function (req, res) {
    var where = req.query;
    var body = req.body;

    _removeMemo(req, where, body, function (error, results) {
        res.json({ error : error, results : results});
    });
};

function _insertMemo(req, card, callback) {
    req.db.collection('test', function(err, collection) {
        collection.insert(card, {safe:true}, callback);
    });
}

function _findMemo(req, where, callback) {
    where = where || {};

    console.log("where: " + JSON.stringify(where));
    req.db.collection('test', function(err, collection) {
        collection.find(where).toArray(callback);
    });
}

function _updateMemo(req, where, body, callback) {
    req.db.collection('test', function(err, collection) {
        collection.update(where, {$set : body}, callback);
    });
}

function _removeMemo(req, where, body, callback) {
    req.db.collection('test', function(err, collection) {
        collection.update(where, {$set : body}, callback);
        //collection.remove(where, callback);
    });
}