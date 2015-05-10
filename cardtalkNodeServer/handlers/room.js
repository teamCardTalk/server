/**
 * Created by fodrh on 2015. 5. 10..
 */



exports.join = function (req, res) {
    var body = req.body,
        userID = body.userid,
        roomID = body.roomid,
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
                res.end('join room!');
                ch.close();
            });
        });
    });
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


