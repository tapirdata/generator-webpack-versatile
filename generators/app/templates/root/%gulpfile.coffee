
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

# console.log 'dirs=', dirs

si = 
  port: config.server.port || 8000
  server: null
  isRunning: () ->
    !! @server
  start: (done) ->
    done = done or ->
    if @isRunning()
      console.log 'server already running'
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
        console.log 'server stopped'
        @server = null
        done err
        return
    else  
      console.log 'no server running'
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
  return plugins.tap(file, t) ->
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

gulp.task 'build-server-views', ->
  dest = dirs.tgt.server + '/views'
  gulp.src ['**/*.jade'], cwd: dirs.src.server + '/views'
  .pipe plugins.newer dest: dest
  .pipe gulp.dest dest

gulp.task 'build-client-scripts', ->
  dest = dirs.tgt.client + '/scripts'
  gulp.src SCRIPTS, cwd: dirs.src.client + '/scripts'
  .pipe plugins.newer dest: dest, map: mapScript
  .pipe scriptPipe()
  .pipe gulp.dest dest

gulp.task 'build-client-images', ->
  gulp.src ['**/*'], cwd: dirs.src.client + '/images'
  .pipe gulp.dest dirs.tgt.client + '/images'

gulp.task 'build-client-pages', ->
  gulp.src ['**/*'], cwd: dirs.src.client + '/pages'
  .pipe gulp.dest dirs.tgt.client + '/pages'

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
  
gulp.task 'build-client-templates', ->
  srcpath = dirs.src.client + '/templates'
  gulp.src ['**/*.jade'], cwd: srcpath
  .pipe(plugins.debug(title: 'client-jade'))
  .pipe plugins.jade client: true
  .pipe postJadeTemplate srcpath
  .pipe plugins.concat 'templates.js'
  .pipe amdJadeTemplates()
  .pipe gulp.dest dirs.tgt.client + '/scripts'

gulp.task 'build-test-client-scripts', ->
  dest = dirs.tgt.client + '/test/scripts'
  gulp.src scripts, cwd: dirs.test.client + '/scripts'
  .pipe plugins.newer dest: dest, map: mapscript
  .pipe scriptPipe()
  .pipe gulp.dest dest


gulp.task 'serve', (done) ->
  si.start done
  return  


gulp.task 'bs', (done) ->
  browserSync
    proxy: 'localhost:' + si.port
    done


gulp.task 'karma', ->
  karma = require 'karma'
  server = karma.server
  runner = karma.runner
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
      'Chrome'
    ]
    proxies: 
      '/vendor': 'http://localhost:' + si.port + '/vendor'
      '/app':    'http://localhost:' + si.port + '/app'
    client: 
      testFiles: ['foo.test']
    singleRun: true  

  server.start karmaConf, (exitCode) ->  
    console.log 'karma done. code=%s', exitCode
    si.stop()


gulp.task 'build-server', [
  'build-server-scripts' 
  'build-server-views' 
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

gulp.task 'reload-server', ->
  console.log 'reload server...'
  si.restart()

gulp.task 'reload-client', ->
  console.log 'reload client...'
  browserSync.reload()

gulp.task 'reload-client-stream', ->
  console.log 'reload client stream...'
  gulp.src(dirs.tgt.client + '/styles/**/*')
  # .pipe plugins.debug(title: 'reload-client-stream')
  .pipe browserSync.reload stream: true


gulp.task 'watch-src', ->
  gulp.watch [dirs.src.server + '/scripts/' + SCRIPTS], ['build-server-scripts']
  gulp.watch [dirs.src.client + '/scripts/' + SCRIPTS], ['build-client-scripts']
  gulp.watch [dirs.src.client + '/styles/**/*' ], ['build-client-styles']
  gulp.watch [dirs.src.client + '/images/**/*' ], ['build-client-images']
  gulp.watch [dirs.src.client + '/pages/**/*' ], ['build-client-pages']
  gulp.watch [dirs.src.client + '/templates/**/*' ], ['build-client-templates']
  gulp.watch [dirs.test.client + '/scripts/' + SCRIPTS], ['build-test-client-scripts']

gulp.task 'watch-tgt', ->
  gulp.watch [dirs.tgt.server + '/scripts/' + SCRIPTS], ['reload-server']
  gulp.watch [dirs.tgt.client + '/scripts/' + SCRIPTS], ['reload-client']
  gulp.watch [dirs.tgt.client + '/styles/**/*' ], ['reload-client-stream']


gulp.task 'run', -> 
  runSequence 'clean', 'build', 'serve'


