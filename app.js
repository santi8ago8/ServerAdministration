var express = require('express');
var path = require('path');
var fs = require('fs');
var swig = require('swig');
var favicon = require('static-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();
app.engine('html', swig.renderFile);


swig.setDefaults({ cache: false });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('view cache', false);

app.use(favicon());
app.use(
    logger({
        format: ':method :status :response-time ms :url',
        skip: function (req, res) {
            return res.statusCode < 400;
        }
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'I\'m a secret, este es un secreto muy largo y dificil de descubrir',
    resave: false,
    saveUninitialized: true
}));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var options = {};
var mode = 'http';
try {
    console.log(__dirname);
    options.key = fs.readFileSync((__dirname + '/ssl/server.key'));
    options.cert = fs.readFileSync((__dirname + '/ssl/server.crt'));
    options.ca = fs.readFileSync((__dirname + '/ssl/ca.crt'));
    mode = 'https';
}
catch (e) {
    console.log(e, e.stack);
    console.log('Create the certificate! is more secure in the ssl folder.');
    options = undefined;
}

var port = process.env.PORT || 3000;
var server;
if (options)
    server = https.createServer(options, app).listen(port);
else
    server = http.createServer(app).listen(port);
require('./routes/sockets').init(server);
console.log('listen in port: ' + port + " mode: " + mode);
module.exports = app;

process.on('SIGINT', function () {
    console.log('maaaaadeee!!!!');
    //TODO: hacer.
    process.exit();
});
/*
 process.on('SIGKILL', function () {
 console.log('maaaaadeee SIGKILL!!!!');
 //TODO: hacer.
 process.exit();
 });
 */