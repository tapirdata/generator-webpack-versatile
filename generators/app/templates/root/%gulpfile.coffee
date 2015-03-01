
fs = require 'fs'
path = require 'path'
del = require 'del'
glob = require 'glob'
w = require 'when'
minimist = require 'minimist'
_ = require 'lodash'
gulp = require 'gulp'
gutil = require 'gulp-util'
plugins = require('gulp-load-plugins')()
runSequence = require 'run-sequence'
lazypipe = require 'lazypipe'

browserify = require 'browserify'
# browserify-shim = require 'browserify-shim'
coffeeify = require 'coffeeify'
jadeify   = require 'jadeify'
source = require 'vinyl-source-stream'
watchify = require 'watchify'

browserSync = require 'browser-sync'
karma = require 'karma'
jsStylish = require 'jshint-stylish'<% if (use.coffee) { %>
coffeeStylish = require 'jshint-stylish'<% } %>

jshintConfig = require './.jshint.json'<% if (use.coffee) { %>
coffeelintConfig = require './.coffeelint.json'<% } %>

argv = minimist process.argv.slice 2
watchEnabled = false

process.env.NODE_ENV = do ->
  env = argv.env or process.env.NODE_ENV or ''
  if env.match /^prod/
    'production'
  else if env.match /^test/
    'testing'
  else
    'development'
    
config = require 'config'

dirs = 
  bower:  JSON.parse(fs.readFileSync './.bowerrc').directory
  src: 
    root:   '<%= dirs.src %>'
    server: '<%= dirs.serverSrc %>'
    client: '<%= dirs.clientSrc %>'
  test:
    root:   '<%= dirs.test %>'
    server: '<%= dirs.test %>/server' 
    client: '<%= dirs.test %>/client'
  tgt: _.clone(config.dirs.tgt) || {}

_.defaults dirs.tgt,
  root: '.tmp'

_.defaults dirs.tgt,
  server: path.join dirs.tgt.root, 'server'
  client: path.join dirs.tgt.root, 'client'

_.defaults dirs.tgt,
  clientVendor: path.join dirs.tgt.client, 'vendor'


getBundleDefs = (scope) ->
  bundleDefs = [
    {
      name: 'main'
      entries: "./#{dirs.src.client}/scripts/main"
      extensions: ['.coffee', '.jade']
      transform: [coffeeify, jadeify]
      debug: true
      watchable: true
      scopes: ['app']
    }  
    {
      name: 'test-main'
      entries: "./#{dirs.test.client}/scripts/*.test.*"
      extensions: ['.coffee', '.jade']
      transform: [coffeeify, jadeify]
      debug: true
      watchable: true
      destDir: "#{dirs.tgt.client}/test/scripts"
      scopes: ['test']
      destName: 'main.js'
    }  
    { 
      name: 'vendor'
      exports: [
        'jquery'
        'lodash'<% if (use.backbone) { %>
        'backbone'<% } %><% if (use.bootstrap) { %>
        'bootstrap-sass'<% } %>
      ]
    }  
  ]
  _.filter bundleDefs, (bundleDef) ->
    not scope or not bundleDef.scopes or _.indexOf(bundleDef.scopes, scope) >= 0


si = 
  port: config.server.port || 8000
  server: null
  isActive: () ->
    !! @server
  start: (done) ->
    done = done or ->
    if @isActive()
      gutil.log 'server already running!'
      done()
      return
    starter = require "./#{dirs.tgt.server}/scripts/startapp"
    server = starter {
      port: @port
      clientDir: dirs.tgt.client
      vendorDir: dirs.tgt.clientVendor
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

ki = 
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
      'progress'
    ]
    ci: [
      'junit'
    ]

  isActive: () ->
    !! @server
  start: (options, done) ->
    karmaConf =
      urlRoot: '/__karma__/'
      files: [
        {
          pattern: "#{dirs.tgt.client}/scripts/vendor.js"
          watched: false
        }
        {
          pattern: "#{dirs.tgt.client}/test/scripts/main.js"
        }
      ]
      frameworks: [
       'mocha'
      ]
      browsers: if options.ci then @browsers.ci else @browsers.work
      reporters: if options.ci then @reporters.ci else @reporters.work
      junitReporter:
        outputFile: 'test-results.xml'
      proxies:
        '/': "http://localhost:#{si.port}/"
      client:
        captureConsole: true
        mocha:
          bail: true
      singleRun: options.singleRun

    # gutil.log 'karma start...'
    karma.server.start karmaConf, (exitCode) =>
      # gutil.log 'karma start done. code=%s', exitCode
      @server = null
      if done
        done()
    @server = true

  run: _.debounce( 
    (done) ->
      # gutil.log 'karma run...'
      karma.runner.run {}, (exitCode) ->  
        # gutil.log 'karma run done. code=%s', exitCode
        if done
          done()
    1000)

 
handleError = (err) ->
  gutil.log gutil.colors.red('ERROR: ' + err)
  @emit 'end'

streams = 
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
      if si.isActive()
        si.restart -> 
          if browserSync.active
            browserSync.reload()
          if ki.isActive()
            ki.run()


  reloadClient: ->
    if browserSync.active
      browserSync.reload stream: true
    else
      plugins.tap ->
        if ki.isActive()
          ki.run()


G_ALL    = '**/*'
G_JS     = '**/*.js'<% if (use.coffee) { %>
G_COFFEE = '**/*.coffee'
G_SCRIPT = '**/*.{js,coffee}'<% } else { %>
G_SCRIPT = G_JS<% } %>
G_JADE   = '**/*.jade'
G_CSS    = '**/*.css'<% if (use.sass) { %>
G_SASS   = '**/*.sass'
G_SCSS   = '**/*.scss'<% } %>

mapScript = (p) -> 
  gutil.replaceExtension p, '.js'


scriptPipe = -><% if (use.coffee) { %>
  coffeeFilter = plugins.filter [G_COFFEE]<% } %>
  do lazypipe()<% if (use.coffee) { %>
  .pipe -> coffeeFilter
  .pipe plugins.coffeelint, coffeelintConfig
  .pipe plugins.coffeelint.reporter
  .pipe plugins.coffee
  .pipe coffeeFilter.restore<% } %>
  .pipe plugins.jshint, jshintConfig
  .pipe plugins.jshint.reporter, jsStylish


buildBrowsified = (bundleDefs, options) ->

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
      destDir: bundleDef.destDir or "#{dirs.tgt.client}/scripts"
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
        .pipe streams.reloadClient()

    defer = w.defer()  
    promises.push defer.promise

    buildIt = ->
      b.bundle()
      .on 'error', handleError
      .pipe source bundle.destName
      .pipe gulp.dest bundle.destDir

    buildIt()
    .pipe plugins.tap ->
      # gutil.log 'Build done: ' + gutil.colors.blue(bundle.name)
      defer.resolve()

  w.all(promises)


gulp.task 'clean', (done) ->
  del dirs.tgt.root, done

gulp.task 'build-server-scripts', ->
  dest = "#{dirs.tgt.server}/scripts"
  gulp.src G_SCRIPT, cwd: "#{dirs.src.server}/scripts"
  .pipe streams.plumber()
  .pipe plugins.newer dest: dest, map: mapScript
  .pipe scriptPipe()
  .pipe gulp.dest dest
  .pipe streams.reloadServer()

gulp.task 'build-server-templates', ->
  dest = "#{dirs.tgt.server}/templates"
  gulp.src [G_JADE], cwd: "#{dirs.src.server}/templates"
  .pipe streams.plumber()
  .pipe plugins.newer dest: dest
  .pipe gulp.dest dest
  .pipe streams.reloadServer()

gulp.task 'build-server-starter', ->
  dest = __dirname
  gulp.src G_SCRIPT, cwd: "#{dirs.src.server}/starter"
  .pipe streams.plumber()
  .pipe scriptPipe()
  .pipe gulp.dest dest

gulp.task 'hint-client-scripts', ->
  dest = "#{dirs.tgt.client}/scripts"
  destName = 'main.js'
  gulp.src G_SCRIPT, cwd: "#{dirs.src.client}/scripts"
  .pipe streams.plumber()
  .pipe plugins.newer dest: "#{dest}/#{destName}"
  .pipe scriptPipe() # just hint & forget

gulp.task 'build-client-scripts', ['hint-client-scripts'], ->
  buildBrowsified getBundleDefs('app'), doWatch: watchEnabled

gulp.task 'build-client-images', ->
  gulp.src [G_ALL], cwd: "#{dirs.src.client}/images"
  .pipe streams.plumber()
  .pipe gulp.dest "#{dirs.tgt.client}/images"
  .pipe streams.reloadClient()

gulp.task 'build-client-pages', ->
  gulp.src [G_ALL], cwd: "#{dirs.src.client}/pages"
  .pipe streams.plumber()
  .pipe gulp.dest "#{dirs.tgt.client}/pages"
  .pipe streams.reloadClient()

gulp.task 'build-client-styles', -><% if (use.sass) { %>
  sassFilter = plugins.filter [G_SASS]
  scssFilter = plugins.filter [G_SCSS]<% } %>
  gulp.src [G_CSS<% if (use.sass) { %>, G_SASS, G_SCSS<% } %>], cwd: "#{dirs.src.client}/styles"
  .pipe streams.plumber()<% if (use.bootstrap) { %>
  .pipe plugins.template 
    bootstrap: 'node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss'<% } %><% if (use.sass) { %>
  .pipe sassFilter
  .pipe plugins.sass indentedSyntax: true
  .pipe sassFilter.restore()
  .pipe scssFilter
  .pipe plugins.sass()
  .pipe scssFilter.restore()<% } %>
  .pipe gulp.dest "#{dirs.tgt.client}/styles"
  .pipe streams.reloadClient()

<% if (use.mondernizr) { %>gulp.task 'build-client-vendor-mondernizr', ->
  gulp.src ['modernizr.js'], cwd: 'bower_components/modernizr'
  .pipe gulp.dest "#{dirs.tgt.clientVendor}/modernizr"<% } %>

<% if (use.bootstrap) { %>gulp.task 'build-client-vendor-bootstrap', ->
  gulp.src ['**/*'], cwd: 'node_modules/bootstrap-sass/assets/fonts'
  .pipe gulp.dest "#{dirs.tgt.clientVendor}/bootstrap/assets/fonts"<% } %>

gulp.task 'nop', ->

gulp.task 'build-client-vendor-assets', (done) ->
  runSequence [<% if (use.mondernizr) { %>
    'build-client-vendor-mondernizr'<% } %><% if (use.bootstrap) { %>
    'build-client-vendor-bootstrap'<% } %>
    'nop'
  ], done

gulp.task 'hint-test-client-scripts', ->
  dest = "#{dirs.tgt.client}/test/scripts"
  destName = 'main.js'
  gulp.src G_SCRIPT, cwd: "#{dirs.test.client}/scripts"
  .pipe streams.plumber()
  .pipe plugins.newer dest: "#{dest}/#{destName}"
  .pipe scriptPipe() # just hint & forget

gulp.task 'build-test-client-scripts', ['hint-test-client-scripts'], ->
  buildBrowsified getBundleDefs('test'), doWatch: watchEnabled

gulp.task 'serve', (done) ->
  si.start done
  return  

gulp.task 'bs', (done) ->
  browserSync
    proxy: "localhost:#{si.port}"
    done

gulp.task 'karma-work', (done) ->
  ki.start singleRun: true, ->
    si.stop(done)

gulp.task 'karma-ci', (done) ->
  ki.start singleRun: true, ci: true, ->
    si.stop(done)

gulp.task 'karma-watch', ->
  ki.start singleRun: false


gulp.task 'build-server-assets', (done) ->
  runSequence [
    'build-server-templates' 
  ], done

gulp.task 'build-server', (done) ->
  tasks = [
    'build-server-scripts' 
    'build-server-assets' 
  ]
  if process.env.NODE_ENV == 'production'
    tasks.push 'build-server-starter'
  runSequence tasks, done

gulp.task 'build-client-assets', (done) ->
  runSequence [
    'build-client-images' 
    'build-client-styles'
    'build-client-pages'
    'build-client-vendor-assets'
  ], done

gulp.task 'build-client', (done) ->
  runSequence [
    'build-client-assets' 
    'build-client-scripts' 
  ], done

gulp.task 'build-test', (done) -> 
  runSequence [
    'build-server' 
    'build-client-assets' 
    'build-test-client-scripts' 
  ], done

gulp.task 'build', (done) -> 
  runSequence [
    'build-server' 
    'build-client' 
  ], done


gulp.task 'watch-on', -> 
  watchEnabled = true

gulp.task 'watch-server-assets', ->
  gulp.watch ["#{dirs.src.server}/templates/#{G_ALL}"], ['build-server-templates']

gulp.task 'watch-server-scripts', ->
  gulp.watch ["#{dirs.src.server}/scripts/#{G_SCRIPT}"], ['build-server-scripts']

gulp.task 'watch-server', ['watch-server-assets', 'watch-server-scripts']

gulp.task 'watch-client-assets', ->
  gulp.watch ["#{dirs.src.client}/styles/#{G_ALL}"], ['build-client-styles']
  gulp.watch ["#{dirs.src.client}/images/#{G_ALL}"], ['build-client-images']
  gulp.watch ["#{dirs.src.client}/pages/#{G_ALL}"], ['build-client-pages']

gulp.task 'watch-client-scripts', ->
  gulp.watch ["#{dirs.src.client}/scripts/#{G_SCRIPT}"], ['hint-client-scripts']

gulp.task 'watch-test-client-scripts', ->
  gulp.watch ["#{dirs.test.client}/scripts/#{G_SCRIPT}"], ['hint-test-client-scripts']

gulp.task 'watch-client', ['watch-client-assets', 'watch-client-scripts']

gulp.task 'watch', ['watch-server', 'watch-client']

gulp.task 'watch-test', ['watch-test-client-scripts']

gulp.task 'run', (done) ->
  runSequence 'clean', 'build', 'serve', done

gulp.task 'run-watch', (done) ->
  runSequence 'watch-on', 'clean', 'build', ['serve', 'bs'], 'watch', done

gulp.task 'test-work', (done) ->
  runSequence 'clean', 'build-test', ['serve', 'karma-work'], done

gulp.task 'test-ci', (done) ->
  runSequence 'clean', 'build-test', ['serve', 'karma-ci'], done

gulp.task 'test-watch', (done) ->
  runSequence 'watch-on', 'clean', 'build-test', ['serve', 'karma-watch'], ['watch-server', 'watch-client-assets', 'watch-test'], done

gulp.task 'default', ['run-watch']

