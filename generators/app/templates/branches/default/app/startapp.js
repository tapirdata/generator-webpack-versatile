var http = require('http')
var appFactory = require('./app-factory.js')

var argv = require('optimist').argv;

var options = {
  port:     argv.port || 80,
  develop: !!argv.develop
}

var app = appFactory(options)

var server = http.createServer(app).listen(options.port, function() {
  console.log("Express server listening on port " + options.port);
});
