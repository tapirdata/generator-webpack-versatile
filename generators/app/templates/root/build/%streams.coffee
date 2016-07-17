plugins = require('gulp-load-plugins')()
browserSync = require 'browser-sync'

module.exports = (build) ->

  plumber: ->
    plugins.plumber
      errorHandler: (err) ->
        gutil.log(
          gutil.colors.red('Error:\n')
          err.toString()
        )
        @emit 'end'

  reloadServer: ->
    plugins.tap ->
      if build.serverState.isActive()
        build.serverState.restart ->
          if browserSync.active
            browserSync.reload()
          if build.karmaState.isActive()
            build.karmaState.run()


  reloadClient: ->
    if browserSync.active
      browserSync.reload stream: true
    else
      plugins.tap ->
        if build.karmaState.isActive()
          build.karmaState.run()

  rerunMocha: (options) ->
    plugins.tap ->
      if build.watchEnabled
        build.mochaState.restart()


