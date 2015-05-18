// set timezone
var gcm = require('node-gcm');
var dateformat = require('dateformat');
var Chat = require('../model/chat.js');

process.env.TZ = 'Asia/Seoul';

exports.create = function (req, res) {

    var chat = new Chat();
    chat.sendMessage(req, res);
    //chat.test(req,res);
};

exports.read = function (req, res){
    var getquery = req.params.getquery;
    console.log("getquery: " + getquery);
    var where = {articleid: getquery};

    Chat.find(where, function(err, chats) {
        res.json(chats);
    });
};

//function _insertChat(req, body, callback) {
//    body = typeof body === 'string' ? JSON.parse(body) : body;
//
//    req.db.collection('chats', function(err, collection) {
//       collection.insert(body, {safe:true}, callback);
//    });
//}
//
//function _findChat(req, where, callback) {
//    where = where || {};
//    console.log("where: " + JSON.stringify(where));
//    req.db.collection('chats', function(err, collection) {
//       collection.find(where).toArray(callback);
//    });
//}

