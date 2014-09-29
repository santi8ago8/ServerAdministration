window.sA = angular.module('ServerAdministration', []);

sA.controller("engine", ["$scope", "SocketController", function ($scope, SocketController) {


    $scope.showLogin = false;

    //only one time
    SocketController.SetScope($scope);

}]);