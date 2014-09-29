sA.controller('TerminalController',
    ['$scope', 'SocketController', function ($scope, SocketController) {

        $scope.terminals = [];
        $scope.name;
        /*
         var engine = require('engine');

         function TerminalController(parent, socketWriter) {
         this.parent = boq.u.qs(parent);
         this.socketWriter = socketWriter;
         this.terminals = boq.Array();
         Eventer(this);



         }*/

        $scope.show = function (data) {


            $scope.$root.$emit('tct:loginSendMeData', function (data) {
                $scope.name = data.name;
            });
            //$scope.name = data.name;

            // para enviar ready to receive
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
            console.log('ready');
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
                if (t.ready && t.pid == data.pid) {
                    $scope.$root.$emit('termView:data' + data.pid, data);
                } else {
                    if (!buffer)
                        $scope.bufferConsole.push(data);
                }
            });
        };
        $scope.closeTerminal = function (_, data) {
            $scope.$root.$emit('termView:close' + data.pid, data);
            /*
             for (var i = 0; i < this.terminals.length; i++) {
             var t = this.terminals[i];

             if (t.pid == data.pid) {
             t.emit('close', data);
             this.terminals.removeAt(i);
             i--;
             }
             }*/
        };
        $scope.closeTerminalUI = function (_, data) {

            for (var i = 0; i < $scope.terminals.length; i++) {
                var t = $scope.terminals[i];
                if (data.pid == t.pid) {
                    $scope.terminals.splice(i, 1);
                    i--;
                }
            }
            $scope.$apply();
        };

        $scope.close = function () {
            this.terminals.each(function (t) {

                $scope.$root.$emit('termView:close' + data.pid, data);
            });

            console.log('closing');
            this.els.header.f().classList.add('close');


            //wait animation.
            var tm = boq.timeout(420, this);
            tm.then(function () {
                //finally end.
                this.emit('endUI');
            });
        };

        $scope.logout = function () {
            SocketController.sendToSocket('logout', {token: localStorage.getItem('token')})
        };

        /* TODO:
         this.on('close', this.close);
         this.on('term:open', this.openTerminal);
         this.on('term:close', this.closeTerminal);
         this.on('show', this.show);
         this.on('term:data', this.data);
         */

        $scope.$root.$on('term:open', $scope.openTerminal);
        $scope.$root.$on('console:ready', $scope.readyTerminal);
        $scope.$root.$on('console:close', $scope.closeTerminalUI);
        $scope.$root.$on('term:close', $scope.closeTerminal);
        $scope.$root.$on('term:data', $scope.data);
        console.log('uno iniciado.' + (ii++));
        //unbind
        $scope.$on('$destroy', function (event, destroy) {
            $scope.$root.$$listeners['term:open'] = [];
            $scope.$root.$$listeners['console:ready'] = [];
            $scope.$root.$$listeners['console:close'] = [];
            $scope.$root.$$listeners['term:close'] = [];
            $scope.$root.$$listeners['term:data'] = [];
            console.log('destroy');
        });

    }]);
var ii = 0;

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