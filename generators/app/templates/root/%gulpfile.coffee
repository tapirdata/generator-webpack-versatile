
fs = require 'fs'
path = require 'path'
_ = require 'lodash'
config = require 'config'
gulp = require 'gulp'
plugins = require('gulp-load-plugins')()
runSequence = require 'run-sequence'
through = require 'through2'

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

renameTpl = (path) -> 
  path.basename = path.basename.replace /(.*)\.tpl/, '$1'
  return

postJade = (basePath) ->
  transform = (file, enc, callback) ->
    if (!file.isBuffer())
      this.push file
      callback()
      return
    name = (path.relative basePath, file.path).replace /.js$/, ''
    # console.log 'name=', name 
    from = 'function template(';
    to = 'templates[\'' + name + '\'] = function(';
    contents = file.contents.toString().replace(from, to);
    file.contents = new Buffer(contents);
    this.push file
    callback()
  through.obj transform

amdTemplates = ->
  return plugins.insert.wrap 'define([\'jade\'], function(jade) {\nvar templates={};\n', '\nreturn templates;\n})\n'

gulp.task 'clean', ->
  gulp.src dirs.tgt.root, read: false
  .pipe plugins.clean()

gulp.task 'make-server-scripts', ->
  coffeeFilter = plugins.filter ['**/*.coffee']
  tplFilter = plugins.filter ['**/*.tpl.*']
  gulp.src ['*.js', '*.coffee'], cwd: dirs.src.server + '/scripts/**'
  .pipe coffeeFilter
  .pipe plugins.coffee()
  .pipe coffeeFilter.restore()
  # .pipe(plugins.debug(title: 'server-all'))
  .pipe gulp.dest dirs.tgt.server + '/scripts';

gulp.task 'make-server-views', ->
  gulp.src ['*.jade'], cwd: dirs.src.server + '/views/**'
  .pipe gulp.dest dirs.tgt.server + '/views';

gulp.task 'make-client-scripts', ->
  tplFilter = plugins.filter ['**/*.tpl.*']
  coffeeFilter = plugins.filter ['**/*.coffee']
  gulp.src ['*.js', '*.coffee'], cwd: dirs.src.client + '/scripts/**'
  .pipe tplFilter
  .pipe plugins.template
    appBaseUrl: '/app'
    vendorBaseUrl: '/vendor'
  .pipe plugins.rename(renameTpl)
  .pipe tplFilter.restore()
  .pipe coffeeFilter
  .pipe plugins.coffee()
  .pipe coffeeFilter.restore()
  .pipe gulp.dest dirs.tgt.client + '/scripts'

gulp.task 'make-client-images', ->
  gulp.src ['*'], cwd: dirs.src.client + '/images/**'
  .pipe gulp.dest dirs.tgt.client + '/images'

gulp.task 'make-client-pages', ->
  gulp.src ['*'], cwd: dirs.src.client + '/pages/**'
  .pipe gulp.dest dirs.tgt.client + '/pages'

gulp.task 'make-client-styles', ->
  scssFilter = plugins.filter ['**/*.scss']
  gulp.src ['*.css', '*.scss'], cwd: dirs.src.client + '/styles/**'
  .pipe plugins.template 
    bootstrap: dirs.bower + '/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss'
  .pipe scssFilter
  .pipe plugins.sass()
  .on 'error', (err) -> console.log err.message
  .pipe scssFilter.restore()
  .pipe gulp.dest dirs.tgt.client + '/styles'
  
gulp.task 'make-client-templates', ->
  srcPath = dirs.src.client + '/templates'
  gulp.src ['*.jade'], cwd: srcPath + '/**'
  .pipe(plugins.debug(title: 'client-jade'))
  .pipe plugins.jade client: true
  .pipe postJade srcPath
  .pipe plugins.concat 'templates.js'
  .pipe amdTemplates()
  .pipe gulp.dest dirs.tgt.client + '/scripts'

gulp.task 'make-test-client-scripts', ->
  tplFilter = plugins.filter ['**/*.tpl.*']
  coffeeFilter = plugins.filter ['**/*.coffee']
  gulp.src ['*.js', '*.coffee'], cwd: dirs.test.client + '/scripts/**'
  .pipe tplFilter
  .pipe plugins.template
    appBaseUrl: '/app' 
    vendorBaseUrl: '/vendor'
    testBaseUrl: '/base/' + dirs.tgt.client + '/test'
  .pipe plugins.rename(renameTpl)
  .pipe tplFilter.restore()
  .pipe coffeeFilter
  .pipe plugins.coffee()
  .pipe coffeeFilter.restore()
  .pipe gulp.dest dirs.tgt.client + '/test/scripts'


gulp.task 'serve', ->
  starter = require './' + dirs.tgt.server + '/scripts/startapp'
  runningServer = starter
    port: serverPort
    clientDir: dirs.tgt.client
    vendorDir: dirs.bower
  return  

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
    runningServer.close()


gulp.task 'build', [
  'make-server-scripts' 
  'make-server-views' 
  'make-client-scripts' 
  'make-client-images' 
  'make-client-styles'
  'make-client-pages'
  'make-client-templates'
  ]

gulp.task 'run', -> 
  runSequence 'clean', 'build', 'serve'


