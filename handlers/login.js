/**
 * Created by fodrh on 2015. 5. 10..
 */
var util = require('util'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs'),
    querystring = require('querystring');

var loginError = 1;

exports.signUp = function(req, res) {
    var amqpconn = req.amqpconn,
        redis = req.redis,
        body = req.body,
        userID = body.userid,
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
    res.end(JSON.stringify(req.session));
};

exports.getLogin = function(req, res) {
    console.log("get LogIn");
//status
    res.json({error : loginError});
    //res.render('login.ejs', { message: req.flash('loginMessage') });
};

exports.logout = function(req, res) {
    req.logout();
    res.end('log out');
};
