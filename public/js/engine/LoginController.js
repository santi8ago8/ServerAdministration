sA.controller('LoginController', ["$scope", "SocketController", function ($scope, SocketController) {


    console.log('create login');
    $scope.user = {};


    $scope.show = function () {
        angular.element(document.querySelector('#user')).on('keyup', function (ev) {
            SocketController.binding('login:userText', ev.target.value);
        });
        angular.element(document.querySelector('#pass')).on('keyup', function (ev) {
            SocketController.binding('login:pass', ev.target.value);
        });
    };


    $scope.$root.$on('login:userText', function (_, data) {
        $scope.$apply(function () {
            $scope.user.name = data.value;
        });
    });
    $scope.$root.$on('login:pass', function (_, data) {
        $scope.$apply(function () {
            $scope.user.password = data.value;
        });
    });

    $scope.close = function (ev, data) {

        $scope.$apply(function () {
            $scope.ui.successLogin = true;
            $scope.ui.incData = false;
            $scope.ui.compData = false;
        });
        var tm = setTimeout(function () {
            $scope.$root.$emit('log:endUI', data);
        }, 410);
    };

    $scope.incData = function () {
        $scope.$apply(function () {
            $scope.ui.incData = true;
            $scope.ui.logging = false;
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
    $scope.$on('$destroy', function (event, data) {
        $scope.$root.$$listeners['log:close'] = [];
        $scope.$root.$$listeners['log:incData'] = [];
        $scope.$root.$$listeners['login:userText'] = [];
        $scope.$root.$$listeners['login:pass'] = [];
    });

}]);
sA.directive('login', function () {
    return {
        restrict: 'E',
        templateUrl: '/html/t_login.html',
        link: function (scope, element, attrs) {
            scope.ui = {};
            scope.show();
        }
    };
});