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

    /* var engine = {
     binding: function (data) {
     bindings.each(function (b) {
     if (b.id == data.id) {
     if (typeof b.setter == 'undefined')
     b.el.value = data.value;
     else
     b.setter(data.value, b.el);
     }
     })
     },
     binder: function (boqElement, id, evName, getter, setter) {
     var el = boqElement.f();
     bindings.push({id: id, el: el, getter: getter, setter: setter});
     evName = typeof evName != 'undefined' ? evName : 'keyup';
     if (evName !== false)
     boqElement.on(evName, function () {
     engine.socket.emit('binding', {
     id: id,
     value: typeof getter != 'undefined' ? getter(el) : el.value
     });
     });
     return boqElement;
     },
     unbinder: function (id) {
     for (var i = 0; i < bindings.length; i++) {
     var b = bindings[i];
     if (b.id.lastIndexOf(id) == 0) {
     bindings.splice(i, 1);
     i--;
     }

     }
     }
     };

     engine.socket = new SocketController(engine);
     var bindings = new Array();
     //{id:"string,el:node[,getter:fn][,setter:fb]}

     return engine;*/
}]);
