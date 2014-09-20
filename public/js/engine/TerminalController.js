define('engine/TerminalController', ['boq', 'engine/Eventer', 'text!/html/t_tcontroll.html', 'boq.dom'], function (boq, Eventer, t_tcontroll) {

    var engine = require('engine');

    function TerminalController(parent, socketWriter) {
        this.parent = boq.u.qs(parent);
        this.socketWriter = socketWriter;
        Eventer(this);


        this.on('close', this.close);
        this.on('show', this.show);
    }

    TerminalController.prototype.show = function () {
        var self = this;
        this.parent.html(t_tcontroll);
        this.els = {};


        // para enviar ready to receive
        this.emit('endedInit');
    };

    TerminalController.prototype.close = function () {
        //engine.unbinder('login:');

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