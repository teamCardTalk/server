/**
 * Created by fodrh on 2015. 5. 14..
 */

var mongoose = require('mongoose');
var dateformat = require('dateformat');

var chatSchema = mongoose.Schema({
    articleid : String,
    user : {
        nickname : String,
        userid : String,
        icon : String
    },
    content : String,
    time : String
});

chatSchema.methods.test = function(req, res) {
    console.log(req.body);
    this.time = dateformat(new Date(), 'yy-mm-dd HH:MM');
    this.articleid = req.body.articleid;
    this.user = req.user;
    this.content = req.body.content;

    console.log(this.toString());
    res.end(this.toString())
};


chatSchema.methods.sendMessage = function (req, res) {



    this.time = dateformat(new Date(), 'yy-mm-dd HH:MM');
    this.articleid = req.body.articleid;
    this.user = req.user;
    this.content = req.body.content;

    var amqpconn = req.amqpconn,
        exchange = 'chat',
        roomID = this.articleid;

    amqpconn.createChannel(function(err, ch) {
        if (err !== null) console.error(err);

        ch.publish(exchange, roomID, new Buffer(this.toString()));

        notifyChatMessage(req);
        ch.close();

        this.save(function (err) {
            console.log('save message');
            res.end(this.toString());
        }.bind(this));
    }.bind(this));
};

function notifyChatMessage(req) {
    var roomid = this.articleid,
        redis = req.redis;

    redis.smembers(roomid, function(err, replies) {
        if (err !== null) console.error(err);
        //console.log(replies);

        replies.map(function (userID) {
            redis.hgetall(userID, function(err, userInfo) {
                if (err !== null) console.error(err);
                var deviceType = userInfo.deviceType,
                    deviceId = userInfo.uid;

                notification[deviceType](deviceId, msg);
            });
        });
    });
}

var notification = {
    ios : function (deviceId, message) {
        console.log('notification ios:' + deviceId + '=' + message );
    },
    android : function (deviceId, message) {
        console.log('notification android:' + deviceId + '=' + message );

        var msg = new gcm.Message({
            collapseKey : 'demo',
            delayWhileIdle : true,
            timeToLive : 3,
            data : {
                key1 : message
            }
        });

        var serverAccessKey = 'AIzaSyCi31Rn3MEMZ_eQsk_yoBxiLIGpjAeBCvk';
        var sender = new gcm.Sender(serverAccessKey);
        var registrationIds = [];
        registrationIds.push(deviceId);
        sender.send(msg, registrationIds, 4, function(err, result) {
            //console.log(result);
        });
    }
};

module.exports = mongoose.model('chat', chatSchema);
