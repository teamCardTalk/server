
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var User = require('./user');

var cardSchema = mongoose.Schema({
    author: {
        userid : String,
        nickname : String,
        icon : String,
    },
    file: [{
        path: String,
        name: String
    }],
    title: String,
    createtime: String,
    content: String,
    partynumber: String,
    chattingtime: String,
    status: String
});


cardSchema.methods.setAuthor = function(user) {
    this.author.userid = user.userid;
    this.author.nickname = user.nickname;
    this.author.icon = user.icon;
};

//
//cardSchema.methods.generateHash = function(password) {
//    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//};
//
//cardSchema.methods.validPassword = function(password) {
//    return bcrypt.compareSync(password, this.password);
//};

module.exports = mongoose.model('Card', cardSchema);