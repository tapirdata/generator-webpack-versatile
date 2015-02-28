'use strict'

###jshint quotmark: false ###

path = require 'path'
_ = require 'lodash'

process.env.NODE_ENV = 'production'

config = require 'config'

port = config.server.port || 8000

dirs =
  tgt: _.clone(config.dirs.tgt) || {}

_.defaults dirs.tgt,
  server: path.join dirs.tgt.root, 'server'
  client: path.join dirs.tgt.root, 'client'

_.defaults dirs.tgt,
  clientVendor: path.join dirs.tgt.client, 'vendor'

starter = require "./#{dirs.tgt.server}/scripts/startapp"
    
server = starter
  port: @port
  clientDir: dirs.tgt.client
  vendorDir: dirs.tgt.clientVendor
