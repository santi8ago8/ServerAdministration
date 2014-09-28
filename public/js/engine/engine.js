/*
 var TerminalController = function (socket) {
 var self = this;

 this.socket = socket;
 this.terminals = [];

 this.activeTerminal = undefined;

 this.data = function (data) {

 var active = false;
 self.terminals.forEach(function (t) {
 if (t.pid == data.pid) {
 active = true;
 t.write(data.data);
 }
 });


 return self;
 };
 this.open = function (data) {
 var active = false;
 self.terminals.forEach(function (t) {
 if (t.pid == data.pid) {
 active = true;
 }
 });
 if (!active) {

 var t = new Terminal({
 cols: 80,
 rows: 30,
 screenKeys: true
 });
 t.pid = data.pid;
 self.terminals.push(t);
 t.on('data', function (d) {
 socket.emit('ter:write', {data: d, pid: t.pid});
 });
 //t.open(document.body);
 }
 return self;
 };


 this.close = function (data) {
 console.log("close", data);

 };
 //do it
 this.keyprocess = function (e) {
 if (self.activeTerminal) {
 if (e.keyCode == 38) {
 e.preventDefault();
 e.stopImmediatePropagation();
 e.stopPropagation();
 self.socket.emit('ter:write', {data: '\x1bOA', pid: self.activeTerminal.pid})
 }
 var charCode = e.charCode;
 if (charCode != 0) {
 e.preventDefault();
 e.stopImmediatePropagation();
 e.stopPropagation();
 self.socket.emit('ter:write', {data: String.fromCharCode(charCode), pid: self.activeTerminal.pid})
 }
 }
 };


 };*/

window.sA = angular.module('ServerAdministration', []);

sA.controller("engine", ["$scope", "SocketController", function ($scope, SocketController) {


    $scope.showLogin = false;

    //only one time
    SocketController.SetScope($scope);

}]);

sA.directive('socketbind', ['SocketController', function (SocketController) {
    return {
        restrict: 'A',

        link: function (scope, element, attrs) {
            console.log('link', scope, element, attrs, SocketController);
            var fromSocket = false;
            element.on('keyup', function (ev) {
                SocketController.binding(attrs.socketbind, element.val());
            });
            scope.$watch(attrs.ngModel, function (nv) {


            });
            scope.$root.$on(attrs.socketbind, function (ev, data) {
                console.log('bind');
                fromSocket = false;

                element.val(data.value);
            });

        }
    };
}]);