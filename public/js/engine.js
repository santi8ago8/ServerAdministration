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



    //load templates.
    getFile('/html/main.html', function (res) {
        b.u.log(res);
    });


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
        tc.close()
    });

    document.body.addEventListener('keydown', tc.keyprocess);
    document.body.addEventListener('keypress', tc.keyprocess);
}


var TerminalController = function (socket) {
    var self = this;
    this.socket = socket;
    this.terminals = [];


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
        }
        return self;
    };

    this.close = function (data) {
        console.log("close", data);
    };

    this.keyprocess = function (e) {
        if (e.keyCode == 38) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            self.socket.emit('ter:write', {data: '\x1bOA', pid: self.terminals[0].pid})
        }
        var charCode = e.charCode;
        if (charCode != 0) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            self.socket.emit('ter:write', {data: String.fromCharCode(charCode), pid: self.terminals[0].pid})
        }
    }
};


function Terminal(pid) {

    var self = this;


    this.pid = pid;

    this.write = function (data) {
        var t = clearColors(data);
        console.log(t);

    }

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