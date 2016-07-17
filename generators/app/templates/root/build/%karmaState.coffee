_ = require 'lodash'
karma = require 'karma'


module.exports = (build) ->

  server: null
  browsers:
    work: [
      # 'PhantomJS'
      'Chrome'
      'Firefox'
    ]
    ci: [
      'PhantomJS'
    ]
  reporters:
    work: [
      'mocha'
    ]
    ci: [
      'mocha'
      'junit'
    ]

  isActive: () ->
    !! @server
  start: (options, done) ->
    karmaConf =
      urlRoot: '/__karma__/'
      files: [
        {
          pattern: "#{build.dirs.tgt.client}/scripts/vendor?(-+([a-f0-9])).js"
          watched: false
        }
        {
          pattern: "#{build.dirs.tgt.client}/test/scripts/main?(-+([a-f0-9])).js"
        }
      ]
      frameworks: [
       'mocha'
      ]
      browsers: if build.headlessEnabled then @browsers.ci else @browsers.work
      reporters: if build.headlessEnabled then @reporters.ci else @reporters.work
      junitReporter:
        outputDir: 'results'
        outputFile: 'client.xml'
      proxies:
        '/': "http://localhost:#{build.serverState.port}/"
      client:
        captureConsole: true
        mocha:
          bail: true
      singleRun: options.singleRun
      browserNoActivityTimeout: 10000

    # gutil.log 'karma start...'
    karmaServer = new karma.Server karmaConf, (exitCode) =>
      # gutil.log 'karma start done. code=%s', exitCode
      @server = null
      if done
        done()
    karmaServer.start()    
    @server = true

  run: _.debounce(
    (done) ->
      # gutil.log 'karma run...'
      karma.runner.run {}, (exitCode) ->
        # gutil.log 'karma run done. code=%s', exitCode
        if done
          done()
    1000)



