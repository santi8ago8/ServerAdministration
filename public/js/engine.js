/**
 * Created by santi8ago8 on 13/09/14.
 */

var getFile = function (url, cb) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200)
            cb(ajax.responseText);
    };
    ajax.open('GET', url, true);
    ajax.send();
};


window.addEventListener('load', function () {
    var timer = b.u.timeout(100);
    timer.then(function () {
        init();
    });
});

function init() {

    var socket = io();

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

    document.body.addEventListener('keydown', tc.keyprocess);
    document.body.addEventListener('keypress', tc.keyprocess);
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
            var t = new Terminal(data.pid);
            self.terminals.push(t);
            t.on('active', activeCb).active();
        }
        return self;
    };


    this.close = function (data) {
        console.log("close", data);
        if (self.activeTerminal.pid == data.pid) {
            self.activeTerminal = undefined;
        }
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

    var activeCb = function (terminal) {
        console.log('tem active: ', terminal);
        self.activeTerminal = terminal;

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

function Terminal(pid) {

    var self = this;
    eventer(this);
    this.pid = pid;

    this.write = function (data) {
        var t = clearColors(data);
        console.log(t);
        return self;
    };

    this.active = function () {
        self.emit('active', self);
        return self;
    };


}

function clearColors(text) {
    var re = /\033\[[0-9;]*m/;
    var rep;
    while (rep = re.exec(text)) {

        text = text.replace(rep[0], '');

    }
    if (text && text.length > 0 && text != '')
        return (text.replace(/\033\[[0-9;]*m/, ''));

}