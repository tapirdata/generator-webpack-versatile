gulp = require 'gulp'
plugins = require('gulp-load-plugins')()

module.exports = (build) ->

  start: () ->
    @isActive = true
    reporter = if build.headlessEnabled
      process.env.JUNIT_REPORT_PATH = 'results/server.xml'
      'mocha-jenkins-reporter'
    else
      'spec'
    (
      gulp.src build.globPatterns.TEST,
        cwd: "#{build.dirs.tgt.server}/test/scripts"
        read: false
    )
      .pipe build.streams.plumber()
      .pipe plugins.mocha
        reporter: reporter

  restart: () ->
    if @isActive
      @start()

