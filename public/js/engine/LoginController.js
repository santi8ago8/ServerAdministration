define('engine/LoginController', ['boq', 'engine/Eventer', 'text!/html/t_login.html', 'boq.dom'], function (boq, Eventer, t_login) {


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
        this.els.user = this.parent.q('#user');
        this.els.pass = this.parent.q('#pass');
        this.els.send = this.parent.q('#send').on('click', function (e) {
            self.listButton(e)
        });


    };

    LoginController.prototype.close = function () {
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
            this.socketWriter('login', {name: user, password: pass});
        }
        else {
            this.parent.q('.compData').show();
        }
    };


    return LoginController;
});