

module.exports = (build) ->
  port: build.config.server.port || 8000
  server: null
  isActive: () ->
    !! @server
  start: (done) ->
    done = done or ->
    if @isActive()
      gutil.log 'server already running!'
      done()
      return
    starter = require "../#{build.dirs.tgt.server}/scripts/startapp"
    server = starter {
      port: @port
      clientDir: build.dirs.tgt.client
      vendorDir: build.dirs.tgt.clientVendor
      }, (err) =>
        if not err
          @server = server
        done err

  stop: (done) ->
    done = done or ->
    if @isActive()
      @server.close (err) =>
        # gutil.log 'server stopped.'
        @server = null
        done err
        return
    else
      gutil.log 'no server running!'
      done()
      return

  restart: (done) ->
    done = done or ->
    @stop (err) =>
      if err
        done err
      else
        @start (err) ->
          done err
          return


