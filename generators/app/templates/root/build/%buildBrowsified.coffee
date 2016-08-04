path = require 'path'
mkdirp = require 'mkdirp'
glob = require 'glob'
_ = require 'lodash'
gulp = require 'gulp'
plugins = require('gulp-load-plugins')()
browserify = require 'browserify'
watchify = require 'watchify'
uglifyify   = require 'uglifyify'
exorcist = require 'exorcist'
source = require 'vinyl-source-stream'

module.exports = (build) ->

  (bundleDefs, options) ->

    resolveNames = (names) ->
      _names = []
      if names
        if not _.isArray(names)
          names = [names]
        _.forEach names, (name) ->
          if /[*]/.test(name)
            _names = _names.concat glob.sync name
          else
            _names.push(name)
      _names


    options = options || {}
    exportNames = {}
    bundles = _.map bundleDefs, (bundleDef) ->
      bundle =
        name: bundleDef.name
        entries: resolveNames bundleDef.entries
        transform: bundleDef.transform
        extensions: bundleDef.extensions
        debug: bundleDef.debug
        destDir: bundleDef.destDir or "#{build.dirs.tgt.client}/scripts"
        destName: bundleDef.destName or "#{bundleDef.name}.js"
        doWatch: bundleDef.watchable and options.doWatch
        exportNames: {}

      if bundleDef.exports
        bundle.exports = _.map bundleDef.exports, (exp) ->
          if not _.isObject(exp)
            exp =
              name: exp
          if not exp.alias
            exp.alias = exp.name
          bundle.exportNames[exp.alias] = true
          exportNames[exp.alias] = true
          exp
      else
        bundle.exports = []

      bundle

    promises = []
    bundles.forEach (bundle) ->
      # gutil.log('bundle=', bundle)

      b = browserify
        cache: {}
        entries: bundle.entries
        extensions: bundle.extensions
        transform: bundle.transform
        debug: bundle.debug

      _.forOwn exportNames, (ok, name) ->
        if not bundle.exportNames[name]
          # gutil.log 'external: ', name
          b.external name

      _.forEach bundle.exports, (exp) ->
          # gutil.log 'export: ', exp
          expOpts = {}
          if exp.alias != exp.name
            expOpts.expose = exp.alias
          b.require exp.name, expOpts

      if bundle.doWatch
        b = watchify b
        b.on 'update', (file) ->
          # gutil.log 'Rebuild bundle: ' + gutil.colors.blue(bundle.name)
          buildIt()
            .pipe build.streams.reloadClient()

      buildIt = ->
        if build.mode.isProduction
          b = b.transform
            sourcemap: true
            global: true
            uglifyify
        stream = b.bundle()
        .on 'error', build.handleError

        if bundle.debug
          stream = stream
            .pipe plugins.tap ->
              mkdirp.sync bundle.destDir
            .pipe exorcist path.join bundle.destDir, bundle.destName + '.map'

        stream
          .pipe source bundle.destName<% if (use.crusher) { %>
          .pipe build.crusher.puller()
          .pipe build.crusher.pusher tagger: relativeBase: path.join build.dirs.src.client, 'scripts'<% } %>
          .pipe gulp.dest bundle.destDir


      promises.push new Promise (resolve, recect) ->
        buildIt()
          .pipe plugins.tap ->
            # gutil.log 'Build done: ' + gutil.colors.blue(bundle.name)
            resolve()

    Promise.all promises


