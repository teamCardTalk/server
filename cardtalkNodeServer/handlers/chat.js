// set timezone
process.env.TZ = 'Asia/Seoul';

exports.create = function (req, res) {
    var body = req.body,
        roomID = body.roomid,
        exchange = 'chat',
        amqpconn = req.amqpconn;
//roomid 랑 articleid 랑 통일해야함.
    // apns gcm 등록 해야함.
    amqpconn.createChannel(function(err, ch) {
        if (err !== null) console.error(err);
        ch.publish(exchange, roomID, new Buffer(JSON.stringify(body)));
        notifyChatMessage(JSON.stringify(body), req);
        ch.close();

        _insertChat(req, body, function (error, results) {
            res.json( {error: error, results: results});
        });
    });
};

exports.read = function (req, res){
    var getquery = req.params.getquery;
    console.log("getquery: " + getquery);
    var where = {articleid: getquery};

    _findChat(req, where, function (error, results) {
        res.json(results);
    });
};

function _insertChat(req, body, callback) {
    body = typeof body === 'string' ? JSON.parse(body) : body;
    console.log("body.nickname: " + JSON.stringify(body.nickname));
    var chat = {
        articleid : body.articleid,
        nickname : body.nickname,
        userid : body.userid,
        icon : body.icon,
        content : body.content,
        time : new Date().toLocaleString()
    };

    req.db.collection('chats', function(err, collection) {
       collection.insert(chat, {safe:true}, callback);
    });
}

function _findChat(req, where, callback) {
    where = where || {};
    console.log("where: " + JSON.stringify(where));
    req.db.collection('chats', function(err, collection) {
       collection.find(where).toArray(callback);
    });
}

function notifyChatMessage(msg, req) {
    var msgObj = JSON.parse(msg),
        roomid = msgObj.roomid,
        redis = req.redis;

    redis.smembers(roomid, function(err, replies) {
        if (err !== null) console.error(err);
        replies.forEach(function (userID) {
            redis.hgetall(userID, function(err, userInfo) {
                if (err !== null) console.error(err);
                var deviceType = userInfo.deviceType,
                    deviceId = userInfo.deviceId;

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
    }
};