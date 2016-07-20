
_ = require 'lodash'
minimist = require 'minimist'
plugins = require('gulp-load-plugins')()
gutil = require 'gulp-util'

argv = minimist process.argv.slice 2

mode = require('./mode')(argv.env) # sets process.NODE_ENV
config = require 'config' # uses process.NODE_ENV
dirs = require './dirs'
globPatterns = require './globPatterns'

handleError = (err) ->
  gutil.log gutil.colors.red('ERROR: ' + err)
  @emit 'end'


build = 
  argv: argv
  mode: mode
  config: config
  dirs: dirs
  globPatterns: globPatterns
  watchEnabled: false
  headlessEnabled: false
  handleError: handleError



<% if (use.crusher) { %>
cacheCrusher = require 'cache-crusher'
build.crusher = cacheCrusher
  enabled: false
  extractor:
    urlBase: '/app/'
  mapper:
    counterparts: [{urlRoot: '/app', tagRoot: build.dirs.src.client, globs: '!images/favicon.ico'}]
  resolver:
    timeout: 20000<% } %>


bundleDefs = require('./bundleDefs')(build)

build.getBundleDefs = (scope) ->
  _.filter bundleDefs, (bundleDef) ->
    not scope or not bundleDef.scopes or _.indexOf(bundleDef.scopes, scope) >= 0


build.serverState = require('./serverState')(build)
build.mochaState = require('./mochaState')(build)
build.karmaState = require('./karmaState')(build)
build.streams = require('./streams')(build)
build.buildBrowsified = require('./buildBrowsified')(build)

<% if (use.modernizr) { %>
build.modernizr = require('./modernizr')(build)<% } %>


module.exports = build

