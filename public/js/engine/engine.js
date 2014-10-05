window.sA = angular.module('ServerAdministration', []);

sA.controller("engine", ["$scope", "SocketController", function ($scope, SocketController) {


    $scope.showLogin = false;

    //only one time
    SocketController.SetScope($scope);

}]);

sA.directive('fallbackSrc', function () {
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function () {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
    }
    return fallbackSrc;
});