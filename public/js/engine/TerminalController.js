define('engine/TerminalController', ['boq', 'engine/Eventer', 'text!/html/t_tcontroll.html', 'Terminal', 'boq.dom'], function (boq, Eventer, t_tcontroll, Terminal) {

    var engine = require('engine');

    function TerminalController(parent, socketWriter) {
        this.parent = boq.u.qs(parent);
        this.socketWriter = socketWriter;
        Eventer(this);


        this.on('close', this.close);
        this.on('open', this.openTerminal);
        this.on('show', this.show);
        this.on('data', this.data);
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
    var ter;
    TerminalController.prototype.openTerminal = function (data) {
        var self = this;
        var t = new Terminal({
            cols: 80,
            rows: 30,
            screenKeys: true
        });
        ter = t;
        t.pid = data.pid;

        t.on('data', function (d) {
            self.socketWriter('binding', {id: 'term:write', data: d, pid: t.pid});
        });
        t.open(this.els.console.f());

    };
    TerminalController.prototype.data = function (data) {
        ter.write(data.data)
    };

    TerminalController.prototype.close = function () {
        //engine.unbinder('terc:');
        console.log('closing');
        this.els.header.f().classList.add('close');

        //wait animation.
        var tm = boq.timeout(410, this);
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