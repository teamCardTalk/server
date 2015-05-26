/**
 * Created by fodrh on 2015. 5. 14..
 */
module.exports = {
    'mongo' : {
        'url' : 'mongodb://127.0.0.1:30000/test, ' +
                'mongodb://127.0.0.1:40000/test, ' +
                'mongodb://127.0.0.1:50000/test',
        'opt' : {
            'replSet' : {
                'readPreference': 'ReadPreference.SECONDARY_PREFERRED',
                'slaveOk' : true,
                'rs_name' : 'cardtalk'
            }
        }
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
