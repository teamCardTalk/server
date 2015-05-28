/**
 * Created by fodrh on 2015. 5. 14..
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    userid      : String,
    password    : String,
    nickname    : String,
    icon        : String,
    uid         : String,
    deviceType  : String,
    participatingRooms : [ String ],
    friends      : [ String ]
});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);