define('engine/SocketController', ['io'], function (io) {

    return function (engine) {
        var socket = io();

        var terminalController;
        var loginController;
        var isClosedLogin = false;


        socket.on('hack', function (m) {
            alert(m);
        });

        socket.on('logout', function () {
            //logout events!
            localStorage.setItem('token', '');
            if (terminalController)
                terminalController.emit('close');
            else {
                init();
            }
        });

        var init = function () {
            //try login with token:
            var token = localStorage.getItem('token');
            if (token !== '' && token !== null && token != undefined)
                socket.emit('login:token', {token: token});
            else {
                openLoger();
            }
        };

        socket.on('login', init);

        socket.on('ter:data', function (data) {
            //TODO: made
            console.log(data);
        });
        socket.on('ter:open', function (data) {
            //TODO: made
            console.log(data);
        });
        socket.on('ter:close', function (data) {
            //TODO: made
            console.log(data);
        });
        socket.on('binding', function (data) {
            engine.binding(data);
        });
        socket.on('login:token', function (data) {
            console.log('login:token', data);
            if (data.result == true)
                loginEnded();
            else {
                openLoger();
            }
        });
        socket.on('login:user', function (data) {
            console.log(data);
            if (data.result) {
                loginController.emit('close');
                loginController = undefined;
                isClosedLogin = true;
                localStorage.setItem('token', data.token);
            } else {
                loginController.emit('incData');
            }
        });


        var sendToSocket = function (evname, data) {
            console.log("Writing in socket:", this, evname, data);
            socket.emit(evname, data);
        };

        var loginEnded = function () {
            console.log('login end');


            require(['engine/TerminalController'], function (TerminalController) {
                terminalController = new TerminalController(document.body, sendToSocket);
                //when endedInit execute ready to receive.
                terminalController.on('endedInit', tcEndedInit);
                terminalController.on('endUI', init);

                terminalController.emit('show');
            });


        };

        var tcEndedInit = function () {
            console.log('tcEndedInit');
            socket.emit('readyToReceive');
        };

        var openLoger = function () {
            if (loginController == undefined) {
                require(['engine/LoginController'], function (LoginController) {
                    loginController = new LoginController(document.body, sendToSocket);
                    loginController.on('endUI', loginEnded);
                });
            }
        };


        return socket;
    }
});