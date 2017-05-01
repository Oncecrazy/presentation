var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);
//app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('combined', {stream: accessLog}));

app.use(compression());    //启用压缩
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var oneYear = 86400000*365;
app.use('/static', express.static(path.join(__dirname, 'public'),{maxAge: oneYear}));

app.use('/', express.static(path.join(__dirname, 'presentations'),{maxAge: oneYear}));

// error handlers
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    var status = err.status || 500;
    res.status(status);
    console.error(err.stack);
    switch(req.accepts(['html', 'json'])) {
        case 'html':
            res.render('error', {
                message:err.message,
                error:{}
            });
            break;
        default:
            res.send(status +' Internal Server Error');
    }
});

app.listen(8010, function(){
    console.log("OnlyCoder reveal Server Start, Listen on 8010!");
});

module.exports = app;

