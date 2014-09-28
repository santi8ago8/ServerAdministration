sA.controller('LoginController', ["$scope", "SocketController", function ($scope, SocketController) {


    console.log('create login');


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

    $scope.close = function (ev, data) {

        $scope.$apply(function () {
            $scope.ui.successLogin = true;
            $scope.ui.incData = false;
            $scope.ui.compData = false;
        });
        var tm = setTimeout(function () {
            //this.parent.q('.mainLogin').remove();
            $scope.$root.$emit('log:endUI', data);
        }, 410);
    };

    $scope.incData = function () {
        $scope.$apply(function () {
            $scope.ui.incData = true;
            $scope.ui.logging = true;
        });
    };

    $scope.submit = function () {


        if ($scope.user.name && $scope.user.password) {

            $scope.ui.incData = false;
            $scope.ui.compData = false;
            $scope.ui.logging = true;
            SocketController.sendToSocket('login:user', $scope.user);
        }
        else {
            $scope.ui.compData = true;
        }
    };


    $scope.$root.$on('log:close', $scope.close);
    $scope.$root.$on('log:incData', $scope.incData);
    $scope.show();

}]);
sA.directive('login', function () {
    console.log('login directive');
    return {
        restrict: 'E',
        templateUrl: '/html/t_login.html',
        link: function (scope, element, attrs) {
            scope.ui = {};
            scope.$emit('shown', {a: !false});
        }
    };

});