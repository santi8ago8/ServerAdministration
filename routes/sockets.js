/**
 * Created by santi8ago8 on 13/09/14.
 */

var io = require('socket.io');
var pty = require('pty.js');
var level = require('level');
var ds = require('data-structures');
var uuid = require('uuid-lib');
var cookie = require('cookie');
var db = level('config');
var consolas = [];
var engine = require('./engine');
var d = engine.errorHandler;

exports.init = function (server) {
    io = io(server);
};
exports.initMongo = function (db) {
    startUp();
    initSockets();
};

function startUp() {

    engine.commands.find().toArray(function (err, resp) {
        if (err)
            console.log(err);
        else {
            resp.forEach(function (com) {
                var term = new terminal();
                consolas.push(term);
                term.write(com.command + '\n');
            })
        }
    });

}

function getConfig(key, cb) {

    db.get(key, {valueEncoding: 'json'}, function (err, data) {
        if (err)
            console.log(err);
        else
            cb(data);
    });

}

var terminal = function () {

    var self = this;
    self.rows = 30;
    self.cols = 80;
    self.queue = new ds.Queue();

    self.lastBuffer = new Buffer(self.cols);
    self.lastBufferIndex = 0;
    self.queue.enqueue(self.lastBuffer);

    self.term = pty.spawn('bash', [], {
        name: ' ',
        cols: self.cols,
        rows: self.rows,
        cwd: process.env.HOME,
        env: process.env
    });
    this.pid = self.term.pid;
    this.write = function (data) {
        self.term.write(data);
    };
    self.term.on('data', function (data) {
        if (data != null) {

            self.queue.enqueue(data);

            if (self.queue.size > 200) {
                self.queue.dequeue();
            }
            io.emit('ter:data', {data: data, pid: self.pid});
        }
    });
    self.term.on('close', function (data) {
        io.emit('ter:close', {pid: self.pid, exit: data});
    });


};

var initSockets = function () {

    io.use(function (socket, next) {

        var cookie_string = socket.conn.request.headers.cookie;

        var parsed_cookies = cookie.parse(cookie_string);
        var connect_sid = parsed_cookies['connect.sid'];
        socket.roomSession = connect_sid;
        socket.join(connect_sid);

        if (!socket.loged)
            socket.emit('login', {result: false});


        next();
    });

    io.on('connection', function (socket) {


        var doRest = function (user) {
            socket.loginCorrect = true;
            socket.roomLogged = user.name;
            socket.roomGlobal = 'global';
            socket.join(socket.roomLogged);
            socket.join(socket.roomGlobal);

            socket.on('ter:write', function (data) {
                d.run(function () {
                    consolas.forEach(function (c) {
                        if (data.pid === c.pid) {
                            c.write(data.data);
                        }
                    })
                });

            });
            consolas.forEach(function (c) {
                socket.emit('ter:open', {pid: c.pid});
                socket.emit('ter:data', {data: c.queue._content.join(''), pid: c.pid});
            })
        };

        socket.on('logout', function () {
            io.to(socket.roomSession).emit('logout');
        });

        //
        socket.on('login:token', function (data) {
            console.log(data);
            d.run(function () {
                console.log('runing');
                engine.users.findOne({tokens: {$in: [data.token]}}, {name: 1, password: 1}, function (err, user) {
                    if (err)
                        console.log(err);
                    else {

                        if (!user)
                            socket.emit('login:token', {result: false});
                        else {
                            io.to(socket.roomSession).emit('login:token', {result: true});
                        }
                    }
                })
            });
        });

        socket.on('login', function (data) {
            getConfig('user', function (ret) {
                var sd = {};
                sd.result = false;
                sd.token = false;
                if (data.token !== ret.token) {
                    sd.incToken = true;
                }
                if (ret.token && data.token && data.token == ret.token) { //compare token
                    sd.result = true;
                    sd.token = ret.token;
                    socket.loginCorrect = true;

                }
                else if (ret.name === data.name && ret.password === data.password) { //compare passwords
                    sd.result = true;
                    sd.token = uuid.create().value + uuid.create().value;
                    ret.token = sd.token;
                    db.put('user', ret, {valueEncoding: 'json'}, function (err) {
                        if (err) console.log(err);
                    });
                    doRest(ret);
                }

                io.to(socket.roomSession).emit('login', sd);
            });
        });

        socket.on('readyToReceive', function () {
            if (socket.loginCorrect) {
                doRest();
            }
            else {
                socket.emit('hack', 'don\'t hack!');
            }

        });


        /**
         *  Format data{
         *  id : one name of one binding
         *  value: value to bind
         *  }
         */
        socket.on('binding', function (data) {
            var bind = getBinding(data.id);
            console.log(data);
            if (bind) {
                var room;
                if (bind.mode == 'session') {
                    room = socket.roomSession;
                }

                if (room) {
                    if (bind.toMe)
                        io.to(room).emit('binding', data);
                    else
                        socket.to(room).emit('binding', data);
                }
            }
        });
    })

};

function getBinding(id) {
    var ret;
    bindings.forEach(function (b) {
        if (b.id == id)
            ret = b;
    });
    return ret;
}

/**
 * Bindings: {
 *     id: simplemente el id.
 *     mode: 'session'|'account'|'gobal'
 *     // session es a la session en la misma pc tipicas sessiones web del browser.
 *     // account va solo a la cuenta, por ej cuenta: "santi" a todas logueadas santi en donde sea.
 *     // global a todas las cuentas logueadas.
 *     toMe: envia el evento a mi mismo también.
 * }
 * @type {{id: string, mode: string}[]}
 */

var bindings = [
    {id: 'login:name', mode: 'session', toMe: false},
    {id: 'login:userText', mode: 'session', toMe: true},
    {id: 'login:pass', mode: 'session', toMe: false}
];