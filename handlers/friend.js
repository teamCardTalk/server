var formidable = require('formidable'),
    util = require('util'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs'),
    dateformat = require('dateformat'),
    querystring = require('querystring'),
    User = require('../model/user.js');

//var UPLOAD_FOLDER = __dirname + "/data";
var UPLOAD_FOLDER = "../data";

exports.add = function (req, res) {
    var user = req.user;
    var friendid = req.params.userid
    var findid = user.userid;
    var where = {userid: findid};
    var body = { $addToSet: {friends: friendid}}

    User.update(where, body, function(err, results) {
        res.json( {error: err, results: results });
    });
};

exports.remove = function (req, res) {
    var user = req.user;
    var friendid = req.params.userid
    var findid = user.userid;
    var where = {userid: findid};
    var body = { $pull: {friends: friendid}}

    User.update(where, body, function(err, results) {
        res.json( {error: err, results: results });
    });
};

exports.read = function(req, res) {
    var user = req.user;
    var findid = user.userid;
    var wherefirst = {userid: findid}
    var wheresecond = {friends: 1, _id: 0};

    User.find(wherefirst, wheresecond, function (err, results) {
        res.json(results);
    });
};

exports.readdetail = function(req, res) {
    var user = req.user;
    var friendid = req.params.userid
    var where = {userid: friendid};

    User.find(where, function (err, results) {
        res.json(results);
    });
};



