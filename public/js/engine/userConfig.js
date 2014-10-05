/**
 * Created by santi8ago8 on 04/10/14.
 */



sA.directive('userconfig', ['SocketController', function (SocketController) {

    var ctr = function ($scope, $element) {

        $scope.draging = false;
        $scope.dragInsideImage = false;
        $scope.closed = false;
        $scope.incType = false;
        var figure;

        $scope.show = function () {
            figure = angular.element($element[0].querySelector('figure'));
            figure.on('dragover', $scope.dragHover);
            figure.on('drop', $scope.drop);

            window.addEventListener('dragenter', $scope.dragStart);
            window.addEventListener('dragend', $scope.dragLeave);
            window.addEventListener('drop', $scope.dragLeave);

            $scope.$root.$on('cfg:close', $scope.closeCfg);

        };
        $scope.dragStart = function (e) {
            e.preventDefault();
            $scope.draging = true;
            $scope.$apply();
        };
        $scope.dragLeave = function (e) {
            e.preventDefault();
            $scope.draging = false;
            $scope.dragInsideImage = false;
            $scope.$apply();
        };
        $scope.dragHover = function (e) {
            e.preventDefault();
        };
        $scope.drop = function (e) {
            $scope.incType = false;
            var file = e.dataTransfer.files[0];
            if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif') {

                var reader = new FileReader();
                reader.onload = function (ev) {
                    var data = ev.target.result.replace(/^[^,]*,/, '');
                    SocketController.sendToSocket('binding',
                        {id: 'user:picture', data: data, type: file.type});
                };
                reader.readAsDataURL(file);
            } else {
                $scope.incType = true;
            }

            $scope.$apply();
        };
        $scope.closeCfg = function () {
            $scope.closed = true;
            if ($scope.$$phase != '$apply') {
                $scope.$apply();
            }
            setTimeout(function () {
                if ($scope.$root)
                    $scope.$root.$emit('cfgTC:close');
            }, 400)
        };

        $scope.$on('destroy', function () {
            window.removeEventListener('dragenter', $scope.dragStart);
            window.removeEventListener('dragend', $scope.dragLeave);
            window.removeEventListener('drop', $scope.dragLeave);
            $scope.$root.$off('cfg:close', $scope.closeCfg);
        });
    };


    return {
        restrict: 'E',
        replace: false,
        controller: ctr,
        templateUrl: '/html/t_userConfig.html',
        link: function (scope, $element, attrs) {
            scope.show();
        }
    }
}]);