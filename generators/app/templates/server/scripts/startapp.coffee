'use strict'
# var path = require('path');
http = require('http')
argv = require('optimist').argv
# console.log('argv=', argv);
options =
  port: argv.port or 9999
  livereload: if argv.livereload == 'true' then 35729 else argv.livereload
  clientDir: argv.clientDir
  vendorDir: argv.vendorDir
appFactory = require('./app-factory.js')
app = appFactory(options)
http.createServer(app).listen options.port, ->
  console.log 'Express server listening on port ' + options.port
  return
