define('engine/LoginController', ['boq', 'engine/Eventer', 'text!/html/t_login.html', 'boq.dom'], function (boq, Eventer, t_login) {


    function LoginController(parent, socketWriter) {
        this.parent = boq.u.qs(parent);
        this.socketWriter = socketWriter;


        this.on('close', this.close);
        this.show();
    }

    LoginController.prototype.show = function () {
        var self = this;
        this.parent.html(t_login);
        this.parent.q('#send').on('click', function (e) {
            self.listButton(e)
        });
    };

    LoginController.prototype.close = function () {
        console.log('closinggggg......', this);
        alert('cloginn');
    };

    LoginController.prototype.listButton = function (e) {
        var user = this.parent.qs('#user').f().value;
        var password = this.parent.q('#pass').f().value;

        this.socketWriter('login', {name: user, password: password});
    };

    Eventer(LoginController.prototype);


    return LoginController;
});