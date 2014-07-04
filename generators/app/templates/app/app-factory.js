"use strict"
var path = require('path');
var express = require('express')
var routes = require('./routes/index');
var favicon = require('serve-favicon');
var robots = require('robots.txt');

module.exports = function(options) {

  var app = express()
  app.set('port', options.port);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.locals.pretty = true;

  app.use(favicon(path.join(__dirname, '..', 'static', 'images', 'favicon.ico')));
  app.use(robots(path.join(__dirname, '..', 'static', 'pages', 'robots.txt')));
  app.use('/static', express.static(path.join(__dirname, '..', 'static')));

  if (options.develop) {
    app.use(require('connect-livereload')({
      port: 35729
    }));
  }

  app.use('/', routes);

  return app;
}




