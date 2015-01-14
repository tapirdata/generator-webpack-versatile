"use strict"
var path = require('path');
var express = require('express')
var routes = require('./routes/main');
var favicon = require('serve-favicon');
var robots = require('robots.txt');

module.exports = function(options) {

  var app = express()
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.locals.pretty = true;

  var staticDir = path.join(__dirname, '..', 'static');
  var vendorDir = path.join(__dirname, '..', 'bower_components');

  app.use(favicon(path.join(staticDir, 'images', 'favicon.ico')));
  app.use(robots(path.join(staticDir, 'pages', 'robots.txt')));
  app.use('/static', express.static(staticDir));
  app.use('/vendor', express.static(vendorDir));

  if (options.develop) {
    app.use(require('connect-livereload')({
      port: 35729
    }));
  }

  app.use('/', routes);

  return app;
}




