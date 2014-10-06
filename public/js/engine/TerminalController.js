sA.controller('TerminalController',
    ['$scope', 'SocketController', function ($scope, SocketController) {

        $scope.terminals = [];
        $scope.closing = false;
        $scope.userConfig = false;
        $scope.user = {};

        $scope.show = function (data) {
            $scope.$root.$emit('tct:loginSendMeData', function (data) {
                $scope.user = data;

            });

            $scope.$root.$emit('tct:endedInit');
        };

        $scope.open = function () {
            //send open to socket.
            SocketController.sendToSocket('binding', {id: 'term:open'});
        };
        $scope.openTerminal = function (_, data) {
            $scope.$apply(function () {

                $scope.terminals.push(data);
            });
        };
        $scope.bufferConsole = [];
        $scope.readyTerminal = function (_, data) {
            angular.forEach($scope.terminals, function (t) {
                if (t.pid == data.pid) {
                    t.ready = true;
                }
            });
            angular.forEach($scope.bufferConsole, function (it) {
                $scope.data(0, it, true);
            });
            for (var i = 0; i < $scope.bufferConsole.length; i++) {
                var buf = $scope.bufferConsole[i];
                if (data.pid == buf.pid) {
                    $scope.bufferConsole.splice(i, 1);
                    i--;
                }
            }
        };
        $scope.data = function (_, data, buffer) {
            angular.forEach($scope.terminals, function (t) {
                if (t.pid == data.pid) {
                    if (t.ready)
                        $scope.$root.$emit('termView:data' + data.pid, data);
                    else {
                        if (buffer !== true) {
                            $scope.bufferConsole.push(data);
                        }
                    }
                }
            });
        };
        $scope.closeTerminal = function (_, data) {
            $scope.$root.$emit('termView:close' + data.pid, data);

        };
        $scope.closeTerminalUI = function (_, data) {
            $scope.$apply(function () {
                for (var i = 0; i < $scope.terminals.length; i++) {
                    var t = $scope.terminals[i];
                    if (data.pid == t.pid) {
                        $scope.terminals.splice(i, 1);
                        i--;
                    }
                }
            });
        };

        $scope.close = function () {
            angular.forEach($scope.terminals, function (t) {
                $scope.$root.$emit('termView:close' + t.pid);
            });

            $scope.closeCfgUser();

            $scope.$apply(function () {
                // $scope.terminals = [];
                $scope.closing = true;
            });


            setTimeout(function () {
                $scope.$root.$emit('tct:endUI');
            }, 420);

        };

        $scope.logout = function () {
            SocketController.sendToSocket('logout', {token: localStorage.getItem('token')})
        };

        //config
        $scope.openCfgUser = function () {
            $scope.userConfig = true;
        };
        $scope.closeCfgUser = function () {

            $scope.userConfig = false;
        };
        $scope.imgChange = function (ev, data) {
            $scope.$apply(function () {
                $scope.user.profileImg = data.url;
            });
        };


        $scope.$root.$on('term:open', $scope.openTerminal);
        $scope.$root.$on('console:ready', $scope.readyTerminal);
        $scope.$root.$on('console:close', $scope.closeTerminalUI);
        $scope.$root.$on('term:close', $scope.closeTerminal);
        $scope.$root.$on('term:data', $scope.data);
        $scope.$root.$on('tct:close', $scope.close);
        $scope.$root.$on('user:picture', $scope.imgChange);
        $scope.$root.$on('cfgTC:close', $scope.closeCfgUser);
        //unbind
        $scope.$on('$destroy', function (event, destroy) {

            $scope.$root.$$listeners['term:open'] = [];
            $scope.$root.$$listeners['console:ready'] = [];
            $scope.$root.$$listeners['console:close'] = [];
            $scope.$root.$$listeners['term:close'] = [];
            $scope.$root.$$listeners['term:data'] = [];
            $scope.$root.$off('tct:close', $scope.close);
            $scope.$root.$off('user:picture', $scope.imgChange);
            $scope.$root.$off('cfgTC:close', $scope.closeCfgUser);


        });

    }]);

sA.directive('terminalcontroller', function () {
    return {
        restrict: 'E',
        templateUrl: '/html/t_tcontroll.html',
        link: function (scope, element, attrs) {
            scope.ui = {};
            scope.show();
        }
    };
});