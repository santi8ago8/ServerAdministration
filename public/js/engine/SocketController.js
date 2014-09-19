define('engine/SocketController', ['io'], function (io) {

    var socket = io();
    var loginController;

    socket.on('hack', function (m) {
        alert(m);
    });

    socket.on('login', function (a) {
        if (!a.result) {
            //check if have token to send.
            if (!a.incToken) {
                var token = localStorage.getItem('token');
                if (token)
                    socket.emit('login', {token: token});
                else {
                    if (loginController == undefined) {
                        require(['engine/LoginController'], function (LoginController) {
                            loginController = new LoginController(document.body, sendToSocket);
                            loginController.on('endUI', loginEnded);
                        });
                    }
                }

            }
            else if (loginController == undefined) {
                require(['engine/LoginController'], function (LoginController) {
                    loginController = new LoginController(document.body, sendToSocket);
                    loginController.on('endUI', loginEnded);
                });
            } else {
                //inc Data
                loginController.emit('incData');
            }
        }
        else { //loged
            if (loginController != undefined) {
                loginController.emit('close');
            } else {
                loginEnded();
            }

            localStorage.setItem('token', a.token);
        }
    });

    socket.on('ter:data', function (data) {
        tc.data(data);
    });
    socket.on('ter:open', function (data) {
        tc.open(data);
    });
    socket.on('ter:close', function (data) {
        tc.close(data);
    });

    var sendToSocket = function (evname, data) {
        console.log("Writing in socket:", this, evname, data);
        socket.emit(evname, data);
    };

    var loginEnded = function () {
        console.log('login end');
        //var tc = new TerminalController(document.body, sendToSocket);
    };

    return socket;
});