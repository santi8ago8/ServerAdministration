

function init() {

    var socket = require('io')();

    var tc = new TerminalController(socket);

    socket.on('login', function (a) {
        if (!a.result) {
            //check if have token to send.
            if (!a.incToken) {
                var token = localStorage.getItem('token');
                if (token)
                    socket.emit('login', {token: token});
            }
            //else
            //socket.emit('login', {name: "santi", password: 'foo'});  //this should be in a form. test for now.
        }
        else { //loged

            localStorage.setItem('token', a.token);
        }
    });
    socket.on('ter:data', function (data) {
        tc.data(data);
    });
    socket.on('ter:open', function (data) {
        tc.open(data);
    });
    socket.on('ter:close', function (data) {
        tc.close(data);
    });
}


var TerminalController = function (socket) {
    var self = this;

    this.socket = socket;
    this.terminals = [];
    /**
     *
     * @type {Terminal}
     */
    this.activeTerminal = undefined;

    this.data = function (data) {

        var active = false;
        self.terminals.forEach(function (t) {
            if (t.pid == data.pid) {
                active = true;
                t.write(data.data);
            }
        });


        return self;
    };
    this.open = function (data) {
        var active = false;
        self.terminals.forEach(function (t) {
            if (t.pid == data.pid) {
                active = true;
            }
        });
        if (!active) {

            var t = new Terminal({
                cols: 80,
                rows: 30,
                screenKeys: true
            });
            t.pid = data.pid;
            self.terminals.push(t);
            t.on('data', function(d) {
                socket.emit('ter:write', {data: d, pid: t.pid});
            });
            t.open(document.body);
        }
        return self;
    };


    this.close = function (data) {
        console.log("close", data);

    };
    //do it
    this.keyprocess = function (e) {
        if (self.activeTerminal) {
            if (e.keyCode == 38) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                self.socket.emit('ter:write', {data: '\x1bOA', pid: self.activeTerminal.pid})
            }
            var charCode = e.charCode;
            if (charCode != 0) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                self.socket.emit('ter:write', {data: String.fromCharCode(charCode), pid: self.activeTerminal.pid})
            }
        }
    };



};

function eventer(target) {
    var events = {};
    target = target ? target : this;
    target.on = function (type, cb, scope) {
        checkType(type);
        events[type].push({cb: cb, scope: scope});
        return target;
    };
    target.off = function (type, cb) {
        checkType(type);
        if (!cb) events[type] = [];
        else {
            for (var i = 0; i < events[type].length; i++) {
                var o = events[type][i];
                if (o.cb == cb)
                    events[type].splice(i--, 1);
            }
        }
        return target;
    };
    target.emit = function (type, data) {
        checkType(type);
        var args = Array.apply([], arguments).splice(1);
        for (var i = 0; i < events[type].length; i++) {
            var o = events[type][i];
            o.cb.apply(o.scope || target, args);
        }
        return target;
    };
    function checkType(type) {
        if (typeof events[type] === 'undefined')
            events[type] = [];
    }
}


define('engine', ['io', 'boq', 'swig', 'term', 'engine/local'], function (module, exports, require) {
    init();
    console.log('define engine');
    return {};
});