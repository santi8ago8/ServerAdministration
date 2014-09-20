define('engine/SocketController', ['io'], function (io) {

    return function (engine) {
        var socket = io();

        var loginController;
        var isClosedLogin = false;


        socket.on('hack', function (m) {
            alert(m);
        });

        socket.on('logout', function (data) {
            //logout events!
            console.log('logout');
            localStorage.setItem('token', 's');

            login({result: false});
        });

        var login = function (a) {
            if (!a.result) {
                //check if have token to send.
                if (!a.incToken) {
                    var token = localStorage.getItem('token');
                    if (token !== '')
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
                    if (!a.incToken) // another window send the incorrect token.
                        loginController.emit('incData');
                }
            }
            else { //loged
                if (loginController != undefined) {
                    loginController.emit('close');
                    loginController = undefined;
                    isClosedLogin = true;
                } else {
                    if (!isClosedLogin) {
                        isClosedLogin = true;
                        loginEnded();
                    }
                }

                localStorage.setItem('token', a.token);
            }
        };

        socket.on('login', login);

        socket.on('ter:data', function (data) {
            tc.data(data);
        });
        socket.on('ter:open', function (data) {
            tc.open(data);
        });
        socket.on('ter:close', function (data) {
            tc.close(data);
        });
        socket.on('binding', function (data) {
            engine.binding(data);
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
    }
});