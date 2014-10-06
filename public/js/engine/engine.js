window.sA = angular.module('ServerAdministration', ['ngAnimate']);

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
    };
    return fallbackSrc;
});

sA.run(function ($rootScope) {
    // Custom $off function to un-register the listener.
    $rootScope.$off = function (name, listener) {
        var namedListeners = this.$$listeners[name];
        if (namedListeners) {
            // Loop through the array of named listeners and remove them from the array.
            for (var i = 0; i < namedListeners.length; i++) {
                if (namedListeners[i] === listener) {
                    return namedListeners.splice(i, 1);
                }
            }
        }
    }
});