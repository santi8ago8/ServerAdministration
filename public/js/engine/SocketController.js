sA.service('SocketController', [function () {

    var socket = io();

    var $scope;

    this.SetScope = function (sc) {
        $scope = sc;
        initListeners();
    };

    var terminalController;
    var loginController;
    var isClosedLogin = false;
    var dataLogin;


    socket.on('hack', function (m) {
        alert(m);
    });

    socket.on('logout', function () {
        //logout events!


        localStorage.setItem('token', '');
        $scope.$root.$emit('tct:close');
        /*if (terminalController)
         terminalController.emit('close');
         else {
         init();
         }*/
    });

    var init = function () {
        $scope.$apply(function () {
            $scope.showTerminalController = false;
        });
        //try login with token:
        var token = localStorage.getItem('token');
        if (token !== '' && token !== null && token != undefined)
            socket.emit('login:token', {token: token});
        else {
            openLoger();
        }
    };

    socket.on('login', init);

    socket.on('term:data', function (data) {

        $scope.$root.$emit('term:data', data);

        function clearColors(text) {
            var re = /\033\[[0-9;]*m/;
            var rep;
            while (rep = re.exec(text)) {

                text = text.replace(rep[0], '');

            }
            if (text && text.length > 0 && text != '')
                return (text.replace(/\033\[[0-9;]*m/, ''));

        }

        //console.log(clearColors(data.data))
    });
    socket.on('term:open', function (data) {
        $scope.$root.$emit('term:open', data)
    });
    socket.on('term:close', function (data) {
        $scope.$root.$emit('term:close', data)
    });
    socket.on('binding', function (data) {
        $scope.$root.$emit(data.id, data);
        //engine.binding(data);
    });
    socket.on('login:token', function (data) {
        if (data.result == true)
            loginEnded(false, data);
        else {
            openLoger();
        }
    });
    socket.on('login:user', function (data) {
        if (data.result) {

            $scope.$root.$emit('log:close', data);
            loginController = undefined;
            isClosedLogin = true;
            localStorage.setItem('token', data.token);
        } else {
            $scope.$root.$emit('log:incData');
        }
    });


    this.sendToSocket = function (evname, data) {
        //console.log("Writing in socket:", evname, data);
        socket.emit(evname, data);
    };
    this.binding = function (id, data) {
        socket.emit('binding', {
            id: id,
            value: data
        });
    };


    var loginEnded = function (_, data) {
        console.log('login end', _, data);
        dataLogin = data;
        $scope.$apply(function () {
            $scope.showLogin = false;
            $scope.showTerminalController = true;
        });


    };

    var tcEndedInit = function () {
        //console.log('tcEndedInit');
        socket.emit('readyToReceive');
    };

    var openLoger = function () {
        $scope.$apply(function () {
            $scope.showLogin = true;
        });
    };
    var initListeners = function () {
        $scope.$root.$on('log:endUI', loginEnded);
        $scope.$root.$on('tct:loginSendMeData', function (ev, cb) {
            cb(dataLogin);
        });
        $scope.$root.$on('tct:endedInit', tcEndedInit);
        $scope.$root.$on('tct:endUI', init);
    };

}]);