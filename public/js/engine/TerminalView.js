define('engine/TerminalView', ['boq', 'engine/Eventer', 'text!/html/t_terminal.html', 'Terminal', 'engine/Dragger', 'boq.dom'], function (boq, Eventer, t_terminal, Terminal, Dragger) {

    var engine = require('engine');

    function TerminalView(parent, socketWriter, data) {
        Eventer(this);
        var self = this;
        var temp = document.createElement('div');
        temp.innerHTML = t_terminal;
        var nodo = temp.children[0];
        this.socketWriter = socketWriter;
        this.parent = parent;
        this.parent.f().appendChild(nodo);

        this.els = {};

        this.els.main = boq.qs(nodo);
        this.els.head = this.els.main.qs('.head');
        this.els.title = this.els.main.qs('.title');
        this.els.minimize = this.els.main.qs('.minBtn').on('click', function (data) {
            self.minimize();
        });
        this.els.console = this.els.main.qs('.console');
        Dragger({
            area: this.els.main,
            zone: this.els.head
        });

        var t = new Terminal({
            cols: 80,
            rows: 20,
            screenKeys: true
        });
        this.pid = data.pid;
        this.term = t;

        t.on('data', function (d) {
            self.socketWriter('binding', {id: 'term:write', data: d, pid: self.pid});
        });
        t.open(this.els.console.f());
        this.on('close', this.close);
        this.on('data', this.data);
    }

    TerminalView.prototype.close = function (data) {

        this.els.head.f().classList.add('close');
        this.els.console.f().classList.add('close');
        //wait animation.
        var tm = boq.timeout(410, this);
        tm.then(function () {
            this.els.main.remove();
        });
    };

    TerminalView.prototype.data = function (data) {
        this.term.write(data.data);
        //console.log(data);
        if (data.process) {
            this.els.title.html(data.process);
        }
    };

    TerminalView.prototype.minimize=function() {
        if (this.els.console.f().classList.contains('close')) {
            this.els.console.f().classList.remove('close');
            this.els.console.f().classList.add('open');

        } else {
            this.els.console.f().classList.add('close');
            this.els.console.f().classList.remove('open');
        }
    };

    return TerminalView;
});