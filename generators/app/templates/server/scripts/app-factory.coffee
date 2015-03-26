'use strict'
# coffee quotes "static"
###jshint quotmark: false ###
path = require('path')
express = require('express')
routes = require('./routes/main')
favicon = require('serve-favicon')
robots = require('robots.txt')

module.exports = (options) ->
  app = express()
  app.set 'views', path.join(__dirname, '..', 'templates')
  app.set 'view engine', 'jade'
  app.locals.pretty = true
  app.use favicon(path.join(options.clientDir, 'images', 'favicon.ico'))
  app.use robots(path.join(options.clientDir, 'pages', 'robots.txt'))
  app.use '/app', express.static(options.clientDir)
  app.use '/vendor', express.static(options.vendorDir)
  app.use '/', routes
  app
