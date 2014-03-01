var express = require('express');
var config = require('getconfig');
var app = express();
module.exports = app;

var http = require('http'),
  path = require('path'),
  fs = require('fs'),
  mongojs = require('mongojs');

app.configure(function(){

  app.set('siteport', process.env.PORT || 5001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var agenda = require('./app/bootstraps/agenda');
require('./app/bootstraps/agenda-jobs')(agenda);
console.log('init jobs, ok.');

require('./app/worker')();
console.log('init ping, ok.');

http.createServer(app).listen(app.get('siteport'), function(){
  console.log("Express server listening on port " + app.get('siteport'));
});

