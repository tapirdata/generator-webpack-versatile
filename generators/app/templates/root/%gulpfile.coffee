
fs = require 'fs'
path = require 'path'
_ = require 'lodash'
config = require 'config'
gulp = require 'gulp'
gutil = require 'gulp-util'
plugins = require('gulp-load-plugins')()
runSequence = require 'run-sequence'
lazypipe = require 'lazypipe'
browserSync = require 'browser-sync'
karma = require 'karma'


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

si = 
  port: config.server.port || 8000
  server: null
  isRunning: () ->
    !! @server
  start: (done) ->
    done = done or ->
    if @isRunning()
      console.log 'server already running!'
      done()
      return
    starter = require './' + dirs.tgt.server + '/scripts/startapp'
    server = starter {
      port: @port
      clientDir: dirs.tgt.client
      vendorDir: dirs.bower
      }, (err) => 
        if not err
          @server = server
        done err

  stop: (done) ->
    done = done or ->
    if @isRunning()
      @server.close (err) =>
        # console.log 'server stopped.'
        @server = null
        done err
        return
    else  
      console.log 'no server running!'
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

startKarma = (singleRun, done) ->
  karmaConf = 
    files: [
      {
        pattern: dirs.tgt.client + '/test/scripts/main.js'
      }  
      {
        pattern: dirs.tgt.client + '/test/scripts/**/*.js'
        included: false
      }  
    ]
    frameworks: [
     'mocha'
     'curl-amd'
    ]
    browsers: [
      'PhantomJS'
      'Chrome'
      'Firefox'
    ]
    proxies: 
      '/vendor': 'http://localhost:' + si.port + '/vendor'
      '/app':    'http://localhost:' + si.port + '/app'
    client: 
      testFiles: ['foo.test']
    singleRun: singleRun  

  # console.log 'karma start...'
  karma.server.start karmaConf, (exitCode) ->  
    # console.log 'karma start done. code=%s', exitCode
    if done
      done()

runKarma = (done) ->
  # console.log 'karma run...'
  karma.runner.run {}, (exitCode) ->  
    # console.log 'karma run done. code=%s', exitCode
    if done
      done()

runKarma = _.debounce(runKarma, 1000)


reloadServer = ->  
  plugins.tap -> 
    # console.log 'reloadServer'
    if si.isRunning()
      # console.log 'yeah'
      si.restart -> 
        if browserSync.active
          # console.log 'yeah browserSync'
          browserSync.reload()
        if si.karmaRunning
          # console.log 'yeah karma'
          runKarma()


reloadClient = ->
  # console.log 'reloadClient'
  if browserSync.active
    # console.log 'yeah browserSync'
    browserSync.reload stream: true
  else
    plugins.tap ->
      if si.karmaRunning
        # console.log 'yeah karma'
        runKarma()


SCRIPTS = '**/*.@(js|coffee)'

renameTpl = (name) -> 
  name.replace /(.*)\.tpl/, '$1'

renameTplPath = (path) -> 
  path.basename = renameTpl path.basename
  return

mapScript = (p) -> 
  dirname = path.dirname(p)
  extname = path.extname(p)
  basename = path.basename(p, extname)
  basename = renameTpl basename
  path.join(dirname, basename + '.js')


scriptPipe = ->
  tplData =
    appBaseUrl: '/app'
    vendorBaseUrl: '/vendor'
    testBaseUrl: '/base/' + dirs.tgt.client + '/test'
  coffeeFilter = plugins.filter ['**/*.coffee']
  tplFilter = plugins.filter ['**/*.tpl.*']
  do lazypipe()
  .pipe -> tplFilter
  .pipe plugins.template, tplData
  .pipe plugins.rename, renameTplPath
  .pipe tplFilter.restore
  .pipe -> coffeeFilter
  .pipe plugins.coffee
  .pipe coffeeFilter.restore


postJadeTemplate = (basePath) ->
  return plugins.tap (file, t) ->
    if not file.isNull()
      name = path.relative(basePath, file.path).replace /.js$/, ''
      from = 'function template'
      to = 'templates[\'' + name + '\'] = function'
      if file.isBuffer()
        contents = file.contents.toString().replace(from, to)
        file.contents = new Buffer(contents)
      else  
        callback new gutil.PluginError(
          'postJadeTemplate'
          'streams are not supported yet'
        ) 
    return  


amdJadeTemplates = ->
  return plugins.insert.wrap 'define([\'jade\'], function(jade) {\nvar templates={};\n', '\nreturn templates;\n})\n'

gulp.task 'clean', ->
  gulp.src dirs.tgt.root, read: false
  .pipe plugins.clean()

gulp.task 'build-server-scripts', ->
  dest = dirs.tgt.server + '/scripts'
  gulp.src SCRIPTS, cwd: dirs.src.server + '/scripts'
  .pipe plugins.newer dest: dest, map: mapScript
  .pipe scriptPipe()
  .pipe gulp.dest dest
  .pipe reloadServer()

gulp.task 'build-server-templates', ->
  dest = dirs.tgt.server + '/templates'
  gulp.src ['**/*.jade'], cwd: dirs.src.server + '/templates'
  .pipe plugins.newer dest: dest
  .pipe gulp.dest dest
  .pipe reloadServer()

gulp.task 'build-client-scripts', ->
  dest = dirs.tgt.client + '/scripts'
  gulp.src SCRIPTS, cwd: dirs.src.client + '/scripts'
  .pipe plugins.newer dest: dest, map: mapScript
  .pipe scriptPipe()
  .pipe gulp.dest dest
  .pipe reloadClient()

gulp.task 'build-client-images', ->
  gulp.src ['**/*'], cwd: dirs.src.client + '/images'
  .pipe gulp.dest dirs.tgt.client + '/images'
  .pipe reloadClient()

gulp.task 'build-client-pages', ->
  gulp.src ['**/*'], cwd: dirs.src.client + '/pages'
  .pipe gulp.dest dirs.tgt.client + '/pages'
  .pipe reloadClient()

gulp.task 'build-client-styles', ->
  sassFilter = plugins.filter ['**/*.sass', '**/*.scss']
  gulp.src ['**/*.css', '**/*.sass', '**/*.scss'], cwd: dirs.src.client + '/styles'
  .pipe plugins.template 
    bootstrap: dirs.bower + '/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss'
  .pipe sassFilter
  .pipe plugins.sass()
  .on 'error', (err) -> console.log err.message
  .pipe sassFilter.restore()
  .pipe gulp.dest dirs.tgt.client + '/styles'
  .pipe reloadClient()
  
gulp.task 'build-client-templates', ->
  srcpath = dirs.src.client + '/templates'
  gulp.src ['**/*.jade'], cwd: srcpath
  .pipe(plugins.debug(title: 'client-jade'))
  .pipe plugins.jade client: true
  .pipe postJadeTemplate srcpath
  .pipe plugins.concat 'templates.js'
  .pipe amdJadeTemplates()
  .pipe gulp.dest dirs.tgt.client + '/scripts'
  .pipe reloadClient()

gulp.task 'build-test-client-scripts', ->
  dest = dirs.tgt.client + '/test/scripts'
  gulp.src SCRIPTS, cwd: dirs.test.client + '/scripts'
  .pipe plugins.newer dest: dest, map: mapScript
  .pipe scriptPipe()
  .pipe gulp.dest dest


gulp.task 'serve', (done) ->
  si.start done
  return  


gulp.task 'bs', (done) ->
  browserSync
    proxy: 'localhost:' + si.port
    done

gulp.task 'karma-single', ->
  startKarma true, ->
    si.stop()

gulp.task 'karma', ->
  startKarma false
  si.karmaRunning = true


gulp.task 'build-server', [
  'build-server-scripts' 
  'build-server-templates' 
  ]  

gulp.task 'build-client', [
  'build-client-scripts' 
  'build-client-images' 
  'build-client-styles'
  'build-client-pages'
  'build-client-templates'
  ]

gulp.task 'build-test', [
  'build-test-client-scripts' 
  ]

gulp.task 'build', [
  'build-server' 
  'build-client' 
  ]


gulp.task 'watch-src', ->
  gulp.watch [dirs.src.server + '/scripts/' + SCRIPTS], ['build-server-scripts']
  gulp.watch [dirs.src.server + '/templates/**/*' ], ['build-server-templates']
  gulp.watch [dirs.src.client + '/scripts/' + SCRIPTS], ['build-client-scripts']
  gulp.watch [dirs.src.client + '/styles/**/*' ], ['build-client-styles']
  gulp.watch [dirs.src.client + '/images/**/*' ], ['build-client-images']
  gulp.watch [dirs.src.client + '/pages/**/*' ], ['build-client-pages']
  gulp.watch [dirs.src.client + '/templates/**/*' ], ['build-client-templates']

gulp.task 'watch-test', ->
  gulp.watch [dirs.test.client + '/scripts/' + SCRIPTS], ['build-test-client-scripts']


gulp.task 'run', -> 
  runSequence 'clean', 'build', 'serve'


