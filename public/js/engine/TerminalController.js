define('engine/TerminalController', ['boq', 'engine/Eventer', 'text!/html/t_tcontroll.html', 'engine/TerminalView', 'boq.dom'], function (boq, Eventer, t_tcontroll, TV) {

    var engine = require('engine');

    function TerminalController(parent, socketWriter) {
        this.parent = boq.u.qs(parent);
        this.socketWriter = socketWriter;
        this.terminals = boq.Array();
        Eventer(this);


        this.on('close', this.close);
        this.on('term:open', this.openTerminal);
        this.on('term:close', this.closeTerminal);
        this.on('show', this.show);
        this.on('term:data', this.data);
    }

    TerminalController.prototype.show = function (data) {
        var self = this;
        this.parent.html(t_tcontroll);
        this.els = {};

        this.els.header = this.parent.q('header');
        this.els.userName = this.parent.q('.userName').html(data.name);
        this.els.newter = this.parent.q('.newTerm').on('click', function (data) {
            self.open();
        });
        this.els.logout = this.parent.q('.userConfig').on('click', function (data) {
            self.socketWriter('logout', {token: localStorage.getItem('token')});
        });

        this.els.console = this.parent.q('.console');

        // para enviar ready to receive
        this.emit('endedInit');
    };

    TerminalController.prototype.open = function () {
        //send open to socket.
        this.socketWriter('binding', {id: 'term:open'});
    };
    TerminalController.prototype.openTerminal = function (data) {
        var self = this;
        var t = new TV(self.parent, self.socketWriter, data);
        this.terminals.add(t);
    };
    TerminalController.prototype.data = function (data) {

        this.terminals.each(function (t) {
            if (t.pid == data.pid)
                t.emit('data', data);
        })
    };
    TerminalController.prototype.closeTerminal = function (data) {
        for (var i = 0; i < this.terminals.length; i++) {
            var t = this.terminals[i];

            if (t.pid == data.pid) {
                t.emit('close', data);
                this.terminals.removeAt(i);
                i--;
            }
        }
    };

    TerminalController.prototype.close = function () {
        this.terminals.each(function (t) {
            t.emit('close');
        });

        console.log('closing');
        this.els.header.f().classList.add('close');


        //wait animation.
        var tm = boq.timeout(420, this);
        tm.then(function () {
            //finally end.
            this.emit('endUI');
        });
    };

    TerminalController.prototype.logout = function () {
        this.socketWriter('logout', {token: localStorage.getItem('token')})
    };


    return TerminalController;
})
;