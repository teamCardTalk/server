var formidable = require('formidable'),
    util = require('util'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs'),
    dateformat = require('dateformat'),
    querystring = require('querystring'),
    User = require(../model/user.js);

//var UPLOAD_FOLDER = __dirname + "/data";
var UPLOAD_FOLDER = "../data";

exports.add = function (req, res) {
    var user = req.user;
    var friendid = req.params.userid
    var findid = user.userid;
    var where = {author: {$elemMatch: {userid: findid}}};
    var body = { $addToSet: {friends: {$each: friendid}}}

    User.update(where, body, function(err, results) {
        res.json( {error: err, results: results });
    });
};

exports.remove = function (req, res) {
    var user = req.user;
    var friendid = req.params.userid
    var findid = user.userid;
    var where = {author: {$elemMatch: {userid: findid}}};
    var body = { $pull: {friends: friendid}}

    User.update(where, body, function(err, results) {
        res.json( {error: err, results: results });
    });
};

exports.read = function(req, res) {
    var user = req.user;
    var findid = user.userid;
    var where = {author: {$elemMatch: {userid: findid}}};

    console.log("where: " + JSON.stringify(where));

    Card.find(where, function (err, results) {
        res.json(results);
    });
};




