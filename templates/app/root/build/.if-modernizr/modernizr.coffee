fs = require 'fs'
path = require 'path'
_ = require 'lodash'
Readable = require('stream').Readable
VinylFile = require 'vinyl'
Modernizr = require 'modernizr'

module.exports = (build) ->
  (options) ->
    options or= {}
    configPath = options.configPath
    if configPath == 'ALL'
      modernizrDir = path.dirname require.resolve 'modernizr'
      configPath = path.join modernizrDir, 'config-all.json'
    outStream = new Readable objectMode: true
    buildStarted = false
    outStream._read = ->
      if buildStarted
        outStream.push null
      else
        if configPath 
          try
            config = JSON.parse fs.readFileSync configPath
          catch error
            throw "Cannot find Modernizer config file '#{configPath}': #{error}"
        else
          config = {}
        if options.config
          _.merge config, options.config
        buildStarted = true
        Modernizr.build config, (output) ->
          outFile = new VinylFile
            path: 'modernizr.js'
            contents: new Buffer output
          outStream.push outFile
    outStream



