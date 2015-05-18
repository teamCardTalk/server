var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var localConfig = require('./config/localConfig')

var passport = require('passport');
var redis = require('redis').createClient(),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session);


//
//var mongo = require('mongodb'),
//    Server = mongo.Server,
//    Db = mongo.Db;

var amqp = require('amqplib/callback_api');
var amqpconn;

var app = module.exports = express();

//var writeServer = new Server('localhost', 27017, {auto_reconnect: true}),
//    writeDb = new Db('test', writeServer);
//
//writeDb.open(function(err, db) {
//    if(!err) {
//        console.log("Connected to 'testdb' write database");
//    }
//});

mongoose.connect(localConfig.mongo.url, localConfig.mongo.opt);

amqp.connect('amqp://localhost', function(err, conn) {
    amqpconn = conn;

    on_connect(err, conn);
});

app.use(function(req, res, next) {
    //req["db"] = writeDb;
    // write read 나눠줘야함.
    req["redis"] = redis;
    req["amqpconn"] = amqpconn;
    //req["writeDb"] = writeDb;
    //req["mqttClient"] = mqttClient;
    next();
});

require('./config/passport')(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret : '123456789QWERT',
    store : new RedisStore({
        client : redis
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var routes = require('./routes/index'),
    users = require('./routes/users'),
    memo = require('./routes/memo'),
    card = require('./routes/card')(passport),
    image = require('./routes/image'),
    chat = require('./routes/chat'),
    room = require('./routes/room'),
    login = require('./routes/login')(passport);

app.use('/', routes);
app.use('/users', users);
app.use('/memo', memo);
app.use('/card', card);
app.use('/image', image);
app.use('/chat', chat);
app.use('/room', room);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


function on_connect(err, conn) {
    if (err !== null) console.error(err);
    process.once('SIGINT', function() { conn.close(); });

    var exopts = {durable:true};
    var rootEX = 'chat';
    var notificationEX = 'notification';
    var pushEX = 'push';

    conn.createChannel(function (err, ch) {
        if (err !== null) console.error(err);
        ch.assertExchange(rootEX, 'fanout', exopts, function(err, ok) {
            ch.assertExchange(notificationEX, 'direct', exopts, function (err, ok) {
                ch.assertExchange(pushEX, 'direct', exopts, function(err, ok) {
                    ch.bindExchange(notificationEX, rootEX, '', {}, function(err, ok) {
                        ch.bindExchange(pushEX, rootEX, '', {}, function(err, ok) {
                            console.log('init push server');
                        });
                    });
                });
            });
        });
    });
}

module.exports = app;
