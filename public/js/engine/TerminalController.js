define('engine/TerminalController', ['boq', 'engine/Eventer', 'text!/html/t_tcontroll.html', 'boq.dom'], function (boq, Eventer, t_tcontroll) {

    var engine = require('engine');

    function TerminalController(parent, socketWriter) {
        this.parent = boq.u.qs(parent);
        this.socketWriter = socketWriter;
        Eventer(this);


        this.on('close', this.close);
        this.on('show', this.show);
    }

    TerminalController.prototype.show = function (data) {
        var self = this;
        this.parent.html(t_tcontroll);
        this.els = {};
        this.els.header = this.parent.q('header');
        this.els.userName = this.parent.q('.userName').html(data.name);
        this.els.logout = this.parent.q('.userConfig').on('click', function (data) {
            self.socketWriter('logout', {token: localStorage.getItem('token')});
        });


        // para enviar ready to receive
        this.emit('endedInit');
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
});