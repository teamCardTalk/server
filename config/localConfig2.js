/**
 * Created by fodrh on 2015. 5. 26..
 */
/**
 * Created by fodrh on 2015. 5. 14..
 */
module.exports = {
    'mongo' : {
        'url' : 'mongodb://127.0.0.1:27017/test',
        'opt' : {

        }
        //'opt' : {
        //    'replSet' : {
        //        'readPreference': 'ReadPreference.SECONDARY_PREFERRED',
        //        'slaveOk' : true,
        //        'rs_name' : 'repl'
        //    }
        //
    },
    'redis' : {
        'host' : 'localhost',
        'port' : 6379
    },
    'amqp' : {
        'host' : 'localhost',
        'port' : 15672
    },
    'mqtt' : {

    }
};
