/**
 * Created by santi8ago8 on 13/09/14.
 */

var io = require('socket.io');
var pty = require('pty.js');
var level = require('level');
var ds = require('data-structures');
var uuid = require('uuid-lib');
var db = level('config');
var consolas = [];


exports.init = function (server) {

    io = io(server);

    startUp();
    initSockets();

};

function startUp() {
    getConfig('init', function (a) {
        a.commands.forEach(function (el) {
            var term = new terminal();
            consolas.push(term);
            term.write(el + '\n');
        })
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
        if (!socket.loged)
            socket.emit('login', {result: false});
        next();
    });

    io.on('connection', function (socket) {

        var doRest = function () {
            socket.on('ter:write', function (data) {
                consolas.forEach(function (c) {
                    if (data.pid === c.pid) {
                        c.write(data.data);
                    }
                })
            });
            consolas.forEach(function (c) {
                socket.emit('ter:open', {pid: c.pid});
                socket.emit('ter:data', {data: c.queue._content.join(''), pid: c.pid});
            })
        };

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
                    doRest();
                }
                else if (ret.name === data.name && ret.password === data.password) { //compare passwords
                    sd.result = true;
                    sd.token = uuid.create().value + uuid.create().value;
                    ret.token = sd.token;
                    db.put('user', ret, {valueEncoding: 'json'}, function (err) {
                        if (err) console.log(err);
                    });
                    doRest();
                }

                socket.emit('login', sd);
            });
        })
    })

};