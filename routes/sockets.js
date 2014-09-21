/**
 * Created by santi8ago8 on 13/09/14.
 */

var io = require('socket.io');
var pty = require('pty.js');
var ds = require('data-structures');
var uuid = require('uuid-lib');
var cookie = require('cookie');
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
            //TODO: view heere
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

            consolas.forEach(function (c) {
                socket.emit('ter:open', {pid: c.pid});
                socket.emit('ter:data', {data: c.queue._content.join(''), pid: c.pid});
            })
        };

        socket.on('logout', function (data) {
            //destroy token.
            d.run(function () {
                engine.users.update(
                    {tokens: {$elemMatch: {
                        token: data.token,
                        ip: socket.handshake.address
                    }}},
                    {$pull: {tokens: {
                        token: data.token,
                        ip: socket.handshake.address
                    }}},
                    function (err, resp) {
                        if (err)
                            console.log(err);
                        else {
                            if (resp > 0)
                                io.to(socket.roomSession).emit('logout');
                        }
                    });

            });

        });

        //login token.
        socket.on('login:token', function (data) {
            d.run(function () {
                var ip = socket.handshake.address;
                engine.users.findOne({tokens: {$in: [
                    {token: data.token, ip: ip}
                ]}}, {name: 1, password: 1}, function (err, user) {
                    if (err)
                        console.log(err);
                    else {

                        if (!user)
                            io.to(socket.roomSession).emit('login:token', {result: false});
                        else {
                            var room = io.to(socket.roomSession);
                            room.sockets.forEach(function (s) {
                                s.loginCorrect = true;
                                s.user = user.name;
                            });
                            socket.emit('login:token', {result: true, name: user.name});
                        }
                    }
                })
            });
        });

        //login username and password
        socket.on('login:user', function (data) {
            d.run(function () {
                engine.users.findOne(
                    {name: data.name, password: data.password},
                    {name: 1, password: 1},
                    function (err, user) {
                        if (err)
                            console.log(err);
                        else {

                            if (!user)
                                io.to(socket.roomSession).emit('login:user', {result: false});
                            else {
                                var ip = socket.handshake.address;
                                var token = uuid.create().value + uuid.create().value + uuid.create().value + uuid.create().value + uuid.create().value + uuid.create().value;
                                //save token
                                engine.users.update(
                                    {_id: user._id},
                                    {$addToSet: {tokens: {token: token, ip: ip}}},
                                    {upsert: false, multi: false},
                                    function (err, updated) {
                                        if (err)
                                            console.log('saving token', err);
                                        else {
                                            var room = io.to(socket.roomSession);
                                            room.sockets.forEach(function (s) {
                                                s.loginCorrect = true;
                                                s.user = user.name;
                                            });
                                            room.emit('login:user', {result: true, token: token, name: user.name});
                                        }

                                    }
                                )

                            }
                        }
                    })
            });
        });

        socket.on('readyToReceive', function () {
            if (socket.loginCorrect) {
                doRest(socket);
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
            d.run(function () {
                var bind = getBinding(data.id);

                if (bind) {
                    var room;
                    if (bind.mode == 'session') {
                        room = socket.roomSession;
                    }
                    if (bind.mode == 'account') {
                        room = socket.roomLogged;
                    }
                    if (bind.mode == 'global') {
                        room = socket.roomGlobal;
                    }

                    if (room && bind.cb) {
                        cb(socket, data.extra, room);
                    } else if (room) {
                        if (bind.toMe)
                            io.to(room).emit('binding', data);
                        else
                            socket.to(room).emit('binding', data);
                    }
                }
            });
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
 *     [cb]: ejecuta un trabajo determinado. cancela cualquier otro emit. params (socket,data,room)
 * }
 * @type {{id: string, mode: string}[]}
 */

var bindings = [
    {id: 'login:name', mode: 'session', toMe: false},
    {id: 'login:userText', mode: 'session', toMe: true},
    {id: 'login:pass', mode: 'session', toMe: false},
    {id: 'term:write', mode: 'global', toMe: true, cb: function (socket, data, room) {
        consolas.forEach(function (c) {
            if (data.pid === c.pid) {
                c.write(data.data);
            }
        });
    }}
];