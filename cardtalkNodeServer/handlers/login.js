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
        deviceId = body.deviceId;

    redis.hmset(userID, {'deviceType' : deviceType, 'deviceId' : deviceId}, function(err, obj) {
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


exports.login = function(req, res) {

};

