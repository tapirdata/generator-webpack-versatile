"use strict"
var path = require('path');
var http = require('http')
var argv = require('optimist').argv;

console.log('argv=', argv);

var options = {
  port:       argv.port || 9999,
  livereload: (argv.livereload === 'true') ? 35729 : argv.livereload,
  clientDir:  argv.clientDir,
  vendorDir:  argv.vendorDir
}

var appFactory = require('./app-factory.js')
var app = appFactory(options)

var server = http.createServer(app).listen(options.port, function() {
  console.log("Express server listening on port " + options.port);
});
