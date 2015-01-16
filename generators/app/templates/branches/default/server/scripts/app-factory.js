"use strict"
var path = require('path');
var express = require('express')
var routes = require('./routes/main');
var favicon = require('serve-favicon');
var robots = require('robots.txt');

module.exports = function(options) {

  var app = express()
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'jade');
  app.locals.pretty = true;

  app.use(favicon(path.join(options.clientDir, 'images', 'favicon.ico')));
  app.use(robots(path.join(options.clientDir, 'pages', 'robots.txt')));
  app.use('/static', express.static(options.clientDir));
  app.use('/vendor', express.static(options.vendorDir));

  if (options.livereload) {
    app.use(require('connect-livereload')({
      port: options.livereload
    }));
  }

  app.use('/', routes);

  return app;
}




