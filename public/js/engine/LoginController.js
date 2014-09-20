define('engine/LoginController', ['boq', 'engine/Eventer', 'text!/html/t_login.html', 'boq.dom'], function (boq, Eventer, t_login) {

    var engine = require('engine');

    function LoginController(parent, socketWriter) {
        this.parent = boq.u.qs(parent);
        this.socketWriter = socketWriter;
        Eventer(this);


        this.on('close', this.close);
        this.on('incData', this.incData);
        this.show();
    }

    LoginController.prototype.show = function () {
        var self = this;
        this.parent.html(t_login);
        this.els = {};
        this.els.userText = this.parent.q('h1 .user');
        this.form = this.parent.q('form');
        this.form.on('submit', function (e) {
            e.preventDefault();
            return false;
        });

        engine.binder(this.parent.q('#user'), 'login:userText', 'keyup', undefined, function (n, el) {
            self.els.userText.f().innerText = n;
        });

        this.els.user = engine.binder(this.parent.q('#user'), 'login:name');
        this.els.user.f().focus();
        this.els.pass = engine.binder(this.parent.q('#pass'), 'login:pass');
        /*
         ejemplo de binder en h1,
         se pasa falso el evento para que no asigne el getter
         pero el setter se hace aqui :D
         engine.binder(this.parent.q('.title'), 'login:pass', false, false, function (data, el) {
         el.innerHTML = data;
         });*/

        this.els.send = this.parent.q('#send').on('click', function (e) {
            self.listButton(e)
        });


    };

    LoginController.prototype.close = function () {
        engine.unbinder('login:');
        this.parent.q('.login').f().classList.add('successLogin');
        this.parent.q('.incData').hide();
        var tm = boq.timeout(410, this);
        tm.then(function () {
            console.log('close');
            this.parent.q('.mainLogin').remove();
            this.emit('endUI');
        });
    };
    LoginController.prototype.incData = function () {
        this.parent.q('.incData').show();
        this.els.send.f().classList.remove('logging');
    };

    LoginController.prototype.listButton = function () {
        var user = this.els.user.f().value;
        var pass = this.els.pass.f().value;
        if (user && pass) {
            this.parent.q('.compData').hide();
            this.parent.q('.incData').hide();
            this.els.send.f().classList.add('logging');
            this.socketWriter('login:user', {name: user, password: pass});
        }
        else {
            this.parent.q('.compData').show();
        }
    };

    return LoginController;
});