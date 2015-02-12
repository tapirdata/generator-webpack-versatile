
fs = require 'fs'
path = require 'path'
_ = require 'lodash'
config = require 'config'
gulp = require 'gulp'
plugins = require('gulp-load-plugins')()
runSequence = require 'run-sequence'
through = require 'through2'
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

serverPort = config.server.port || 8000
runningServer = null

startServer = (done) ->
  done = done or ->
  if global.runningServer
    console.log 'server already running'
    done()
    return
  starter = require './' + dirs.tgt.server + '/scripts/startapp'
  runningServer = starter {
    port: serverPort
    clientDir: dirs.tgt.client
    vendorDir: dirs.bower
    }, -> 
      global.runningServer = runningServer
      done()

stopServer = (done) ->
  done = done or ->
  if runningServer
    global.runningServer.close ->
      console.log 'server stopped'
      global.runningServer = null
      done()
      return
  else  
    console.log 'no server running'
    done()
    return

restartServer = (done) ->
  done = done or ->
  stopServer ->
    startServer ->
      done()
      return


SCRIPTS = '**/*.@(js|coffee)'

renameTpl = (name) -> 
  name.replace /(.*)\.tpl/, '$1'

renameTplPath = (path) -> 
  path.basename = renameTpl path.basename
  return

mapScript = (p) -> 
  dir = path.dirname(p)
  base = path.basename(p)
  baseParts = base.match(/^(.*)\.(.*)$/)
  base = renameTpl baseParts[1] + '.js'
  path.join(dir, base)


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
  transform = (file, enc, callback) ->
    if not file.isBuffer()
      @push file
      callback()
      return
    name = (path.relative basePath, file.path).replace /.js$/, ''
    from = 'function template(';
    to = 'templates[\'' + name + '\'] = function(';
    contents = file.contents.toString().replace(from, to);
    file.contents = new Buffer(contents);
    @push file
    callback()
    return
  through.obj transform

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
  startServer done
  return  


gulp.task 'bs', ->
  browserSync
    proxy: 'localhost:' + serverPort


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
      '/vendor': 'http://localhost:' + serverPort + '/vendor'
      '/app':    'http://localhost:' + serverPort + '/app'
    client: 
      testFiles: ['foo.test']
    singleRun: true  

  server.start karmaConf, (exitCode) ->  
    console.log 'karma done. code=%s', exitCode
    stopServer()


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
  restartServer()

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


