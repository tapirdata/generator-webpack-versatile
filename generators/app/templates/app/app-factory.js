"use strict"
var path = require('path');
var express = require('express')
var routes = require('./routes/index');


module.exports = function(options) {

  var app = express()
  app.set('port', options.port);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  if (options.develop) {
    app.use('/', express.static(path.join(__dirname, '../.tmp')));
  }
  app.use('/', express.static(__dirname));

  if (options.develop) {
    app.use(require('connect-livereload')({
      port: 35729
    }));
  }

  app.use('/', routes);

  return app;
}




