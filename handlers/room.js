/**
 * Created by fodrh on 2015. 5. 10..
 */

exports.list = function (req, res) {
    var roomID = req.params.articleid,
        redis = req.redis;

    redis.smembers(roomID, function(err, reply) {
        if (err) console.error(err);
        var returnValue = {
            userList : reply
        };

        res.end(JSON.stringify(returnValue));
    });
};

exports.join = function (req, res) {

    var userID = req.user.userid,
        roomID = req.params.articleid,
        redis = req.redis,
        amqpconn = req.amqpconn;

    var exchange = 'push';

    redis.sadd(roomID, userID, function(err, reply) {
        console.log('sadd ok ' + reply);
    });

    amqpconn.createChannel(function(err, ch) {
        if (err !== null) console.error(err);

        ch.assertExchange(exchange, 'direct', {durable:true}, function(err, ok) {
            ch.bindQueue(userID, exchange, roomID, {durable:true}, function(err, ok) {
                console.log('join room %s to %s', userID, roomID);
                var response = {
                    user : req.user,
                    articleid : roomID
                };
                res.json(response);
                ch.close();
            });
        });
    });
};

exports.out = function(req, res) {

    var userID = req.user.userid,
        roomID = req.params.articleid,
        redis = req.redis,
        amqpconn = req.amqpconn;

    var exchange = 'push';

    redis.srem(roomID, userID, function(err, reply) {
        console.log('srem ok ' + reply);
    });

    amqpconn.createChannel(function(err, ch) {
        if (err !== null) console.error(err);

        ch.unbindQueue(userID, exchange, roomID, {durable : true}, function(err, ok) {
            console.log('get out of room %s', roomID);
            var response = {
                user : req.user,
                articleid : roomID
            };
            res.json(response);
            ch.close();
        });
    })

};


//exports.create = function (req, res) {
//    var body = req.body,
//        amqpconn = req.amqpconn,
//        roomID = body.roomid,
//        exchange = 'notification';
//
//    amqpconn.createChannel(function(err, ch) {
//        if (err !== null) console.error(err);
//
//        ch.assertQueue(roomID, {durable:true}, function(err, ok) {
//            if (err !== null) console.error(err);
//            ch.bindQueue(roomID, exchange, roomID, {}, function(err, ok) {
//                console.log("bind room ok!");
//                res.end("bidn room okd!");
//                ch.close();
//            });
//        });
//    });
//
//    amqpconn.createChannel(function(err, ch) {
//        if (err !== null) console.error(err);
//
//        ch.consume(roomID, notifyChatMessage, {noAck:true}, function(err) {
//            console.log(' Notify Chat Message ');
//        });
//    });
//};


