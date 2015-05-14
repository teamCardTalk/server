/**
 * Created by fodrh on 2015. 5. 10..
 */
var util = require('util'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs'),
    querystring = require('querystring');

exports.signUp = function(req, res) {
    var amqpconn = req.amqpconn,
        redis = req.redis,
        body = req.body,
        userID = body.userid,
        pwd = body.password,
        deviceType = body.deviceType,
        uid = body.uid;

    redis.hmset(userID, {'deviceType' : deviceType, 'uid' : uid}, function(err, obj) {
        console.log('redis hmset ' + obj);
    });

    amqpconn.createChannel(function(err, ch) {
        if (err !== null) console.error(err);
        ch.assertQueue(userID, {durable:true}, function(err, ok) {
            if (err !== null) console.error(err);
            console.log('queue make!');

            res.end('queue make');
            ch.close();
        });
    });




};

exports.loginFail = function(req, res) {
    res.end({'message' : 'login fail'});
};

exports.signupFail = function(req, res) {
    res.end({'message' : 'signup fail'});
};

exports.login = function(req, res) {
    res.end(JSON.stringify(req.user));
};

