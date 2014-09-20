var Db = require('mongodb').Db,
    Server = require('mongodb').Server;
var config = require('../config');
var db = new Db(
    config.mongo.db,
    new Server(config.mongo.host, config.mongo.port),
    {w: 1}
);
var users = db.collection(config.mongo.collUsers);
var commands = db.collection(config.mongo.collCommands);


db.open(function (err, db) {
    if (err)
        console.log('error open mongo', err);
    else {
        users.count(function (err, resp) {
            if (err)
                console.log(err);
            else {
                if (resp == 0) {
                    users.insert(config.firstUser, function (err, resp) {
                        console.log('created first user:', err, resp);
                    })
                }
            }
        });
        commands.count(function (err, resp) {
            if (err)
                console.log(err);
            else {
                if (resp == 0) {
                    commands.insert(config.firstCommands, {w: 1}, function (err, resp) {
                        console.log('created first commands:', err, resp);
                    })
                }
            }
        });

        require('./sockets').initMongo(db);
    }
});

//error handler
var errorHandler = {
    run: function (cb) {
        try {
            cb();
        }
        catch (ex) {
            console.log(ex);
        }
    }
};


module.exports = {
    db: db,
    users: users,
    commands: commands,
    errorHandler: errorHandler
};

