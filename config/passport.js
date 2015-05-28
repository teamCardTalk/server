/**
 * Created by fodrh on 2015. 5. 13..
 */

var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user.js');



module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        console.log('serialize');
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        console.log('deserialize');
        userInfo = {
            userid : user.userid,
            nickname    : user.nickname,
            icon        : user.icon
        };
        done(null, userInfo);

        //findByID 모델 만들어서.
    });

    passport.use('signup', new LocalStrategy({
        usernameField: 'userid',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, userid, password, done) {
        console.log('passprt use' + userid + ' ' + password);

        process.nextTick(function() {
            User.findOne({ 'userid' : userid }, function(err, user) {

                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.' ));
                } else {
                    var body = req.body;
                    var newUser = new User();
                    newUser.userid = userid;
                    newUser.password = newUser.generateHash(password);
                    newUser.nickname = '노란 광대';
                    newUser.icon = 'icon/icon2.png';
                    newUser.uid = body.uid;
                    newUser.deviceType = body.deviceType;

                    newUser.save(function(err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'userid',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, userid, password, done) {
        console.log('login passport use');

        process.nextTick(function() {
            User.findOne({ 'userid' : userid }, function(err, user) {
                if (err) return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'wrong password'));

                return done(null, user);
            });
        });

    }));



};