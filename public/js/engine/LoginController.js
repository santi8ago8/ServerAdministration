sA.controller('LoginController', ["$scope", "SocketController", function ($scope, SocketController) {


    console.log(SocketController);

    function LoginController(parent, socketWriter) {
        this.parent = boq.u.qs(parent);
        this.socketWriter = socketWriter;
        Eventer(this);


    }

    $scope.show = function () {
        /*var self = this;
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
         });

         this.els.send = this.parent.q('#send').on('click', function (e) {
         self.listButton(e)
         });*/


    };

    $scope.close = function (data) {
        engine.unbinder('login:');
        this.parent.q('.login').f().classList.add('successLogin');
        this.parent.q('.incData').hide();
        var tm = boq.timeout(410, this);
        tm.then(function () {
            this.parent.q('.mainLogin').remove();
            this.emit('endUI', data);
        });
    };

    $scope.incData = function () {
        this.parent.q('.incData').show();
        this.els.send.f().classList.remove('logging');
    };

    $scope.listButton = function () {
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


    $scope.$on('shown', function (ev, data) {
        console.log("shown login", data);
    });
    $scope.$on('close', this.close);
    $scope.$on('incData', this.incData);
    $scope.show();

}]);
sA.directive('login', function () {
    console.log('login directive');
    return {
        restrict: 'E',
        templateUrl: '/html/t_login.html',
        link: function (scope, element, attrs) {
            scope.$emit('shown', {a: !false});
        }
    };

});