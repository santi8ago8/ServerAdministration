/**
 * Created by santi8ago8 on 04/10/14.
 */



sA.directive('userconfig', ['SocketController', function (SocketController) {

    var ctr = function ($scope, $element) {

        $scope.draging = false;
        $scope.dragInsideImage = false;
        var figure;

        $scope.show = function () {
            figure = angular.element($element[0].querySelector('figure'));
            figure.on('dragover', $scope.dragHover);
            figure.on('drop', $scope.drop);

            window.addEventListener('dragenter', $scope.dragStart);
            window.addEventListener('dragend', $scope.dragLeave);
            window.addEventListener('drop', $scope.dragLeave);

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
            if (!$scope.dragInsideImage) {
                $scope.dragInsideImage = true;
                $scope.$apply();
            }

        };
        $scope.drop = function (e) {
            var file = e.dataTransfer.files[0];
            if (file.type == 'image/jpeg') {
                console.log('get as string');

                var reader = new FileReader();
                reader.onload = function (ev) {
                    var data = ev.target.result.replace(/^[^,]*,/, '');
                    SocketController.sendToSocket('binding',
                        {id: 'user:picture', data: data, type: file.type});
                };
                reader.readAsDataURL(file);
                /*
                 e.dataTransfer.items[0].getAsString(function (data) {
                 console.log(data);
                 })*/
            }
        };

        $scope.$on('destroy', function (event, data) {
            //TODO: remove listeners.
            window.removeEventListener('dragenter', $scope.dragStart);
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