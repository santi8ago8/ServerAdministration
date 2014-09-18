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
                    if (loginController == undefined)
                        require(['engine/LoginController'], function (LoginController) {
                            loginController = new LoginController(document.body, sendToSocket);
                            console.log('login controller', loginController);


                        });

                }

            }
            else if (loginController == undefined)
                require(['engine/LoginController'], function (LoginController) {
                    loginController = new LoginController(document.body, sendToSocket);
                    console.log('login controller', loginController);


                });
        }
        else { //loged
            if (loginController != undefined) {
                loginController.emit('close');
            }
            var tc = new TerminalController(document.body, sendToSocket);
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

    return socket;
});