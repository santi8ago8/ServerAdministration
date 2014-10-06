sA.directive('terminal', ["SocketController", function (SocketController) {

    var ctr = function ($scope, $element) {
        $scope.pid;

        $scope.minimizing = false;
        $scope.minimized = false;
        $scope.closing = false;
        $scope.shown = function (attrs) {

            $scope.pid = parseInt(attrs.pid);

            Dragger({
                area: $element[0],
                zone: $element[0].querySelector('.head')
            });
            $scope.$root.$on('termView:data' + $scope.pid, function (event, data) {
                t.write(data.data);
                if (data.process) {


                    $scope.title = data.process;

                    if ($scope.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
            });
            $scope.$root.$on('termView:close' + $scope.pid, $scope.close);
            $scope.$root.$emit("console:ready", {pid: $scope.pid});


        };
        var t = new Terminal({
            cols: 80,
            rows: 20,
            screenKeys: true
        });

        t.on('data', function (d) {
            SocketController.sendToSocket('binding', {id: 'term:write', data: d, pid: $scope.pid});

        });
        t.open($element[0].querySelector('.console'));


        var timeout;
        $scope.minimize = function () {
            $scope.minimized = !$scope.minimized;

        };

        $scope.closeUI = function () {
            SocketController.sendToSocket('binding', {id: 'term:close', pid: $scope.pid});
        };

        $scope.close = function (_, data) {
            $scope.$apply(function () {
                $scope.closing = true;
            });
            $element.removeClass('ng-enter');

            if ($scope.$root)
                $scope.$root.$emit('console:close', {pid: $scope.pid});
        };

        $scope.$on('$destroy', function (event, data) {
            $scope.$root.$$listeners['termView:close'] = [];
            $scope.$root.$$listeners['termView:data' + $scope.pid] = [];
        });
    };

    return {
        restrict: 'A',
        replace: true,
        controller: ctr,
        templateUrl: "/html/t_terminal.html",
        link: function (scope, $element, attrs) {
            scope.shown(attrs);
        }
    };

}]);