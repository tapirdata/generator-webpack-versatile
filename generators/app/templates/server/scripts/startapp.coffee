'use strict'
_ = require 'lodash'
http = require 'http'
appFactory = require './app-factory'

module.exports = (options) ->
  _.defaults options,
    port: 8000

  # console.log 'options=', options  
  
  app = appFactory options
  # console.log 'app=', app
  http.createServer(app).listen options.port, ->
    console.log 'Express server listening on port ' + options.port
    return
