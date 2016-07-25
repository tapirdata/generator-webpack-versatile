
fs = require 'fs'
del = require 'del'
gulp = require 'gulp'
gutil = require 'gulp-util'
plugins = require('gulp-load-plugins')()
runSequence = require 'run-sequence'
lazypipe = require 'lazypipe'

browserSync = require 'browser-sync'
jsStylish = require 'jshint-stylish'<% if (use.coffee) { %>
coffeeStylish = require 'jshint-stylish'<% } %>

jshintConfig = require './.jshint.json'<% if (use.coffee) { %>
coffeelintConfig = require './.coffeelint.json'<% } %>

build = require './build'
gp = build.globPatterns


mapScript = (p) ->
  gutil.replaceExtension p, '.js'


makeScriptPipe = -><% if (use.coffee) { %>
  coffeeFilter = plugins.filter [gp.COFFEE], restore: true<% } %>
  jsFilter = plugins.filter [gp.JS], restore: true
  lp = lazypipe()<% if (use.coffee) { %>
    .pipe -> coffeeFilter
    .pipe plugins.coffeelint, coffeelintConfig
    .pipe plugins.coffeelint.reporter
    .pipe plugins.coffee
    .pipe -> coffeeFilter.restore<% } %>
    .pipe -> jsFilter
    .pipe plugins.jshint, jshintConfig
    .pipe plugins.jshint.reporter, jsStylish
    .pipe -> jsFilter.restore
  lp()  



gulp.task 'clean', (done) ->
  del build.dirs.tgt.root, done

gulp.task 'build-server-scripts', ->
  dest = "#{build.dirs.tgt.server}/scripts"
  gulp.src gp.SCRIPT, cwd: "#{build.dirs.src.server}/scripts"
    .pipe build.streams.plumber()
    .pipe plugins.newer dest: dest, map: mapScript
    .pipe makeScriptPipe()
    .pipe gulp.dest dest
    .pipe build.streams.reloadServer()
    .pipe build.streams.rerunMocha()

gulp.task 'build-server-templates', ->
  dest = "#{build.dirs.tgt.server}/templates"
  gulp.src [gp.JADE], cwd: "#{build.dirs.src.server}/templates"
    .pipe build.streams.plumber()
    .pipe plugins.newer dest: dest<% if (use.crusher) { %>
    .pipe build.crusher.puller()<% } %>
    .pipe gulp.dest dest
    .pipe build.streams.reloadServer()
    .pipe build.streams.rerunMocha()

gulp.task 'build-config', ->
  dest = build.dirs.tgt.config
  gulp.src [gp.ALL, '!**/*development*.*', '!**/*testing*.*'], cwd: 'config'
    .pipe build.streams.plumber()
    .pipe makeScriptPipe()
    .pipe gulp.dest dest

gulp.task 'build-starter', ->
  dest = __dirname
  gulp.src gp.SCRIPT, cwd: "#{build.dirs.src.server}/starter"
    .pipe plugins.template configDir: build.dirs.tgt.config
    .pipe build.streams.plumber()
    .pipe makeScriptPipe()
    .pipe gulp.dest dest

gulp.task 'hint-client-scripts', ->
  dest = "#{build.dirs.tgt.client}/scripts"
  destName = 'main.js'
  gulp.src gp.SCRIPT, cwd: "#{build.dirs.src.client}/scripts"
    .pipe build.streams.plumber()
    .pipe plugins.newer dest: "#{dest}/#{destName}"
    .pipe makeScriptPipe() # just hint & forget
    .resume()

gulp.task 'build-client-scripts', ['hint-client-scripts'], ->
  build.buildBrowsified build.getBundleDefs('app'), doWatch: build.watchEnabled

gulp.task 'build-client-images', ->
  gulp.src [gp.ALL], cwd: "#{build.dirs.src.client}/images"
    .pipe build.streams.plumber()<% if (use.crusher) { %>
    .pipe build.crusher.pusher()<% } %>
    .pipe gulp.dest "#{build.dirs.tgt.client}/images"
    .pipe build.streams.reloadClient()

gulp.task 'build-client-pages', ->
  gulp.src [gp.ALL], cwd: "#{build.dirs.src.client}/pages"
    .pipe build.streams.plumber()
    .pipe gulp.dest "#{build.dirs.tgt.client}/pages"
    .pipe build.streams.reloadClient()

gulp.task 'build-client-styles', ->
  templateConfig = {}<% if (use.sass) { %>
  includePaths = []<% if (use.bootstrap) { %>
  templateConfig.bootstrapSassPath = 'node_modules/bootstrap-sass/assets/stylesheets'
  templateConfig.bootstrapSassMain = templateConfig.bootstrapSassPath + '/' + '_bootstrap.scss'<% } if (use.foundation) { %>
  templateConfig.foundationSassPath = 'node_modules/foundation-sites/scss'
  templateConfig.foundationSassMain = templateConfig.foundationSassPath + '/' + 'foundation.scss'
  includePaths.push(templateConfig.foundationSassPath)<% } %>
  sassFilter = plugins.filter [gp.SASS], restore: true
  scssFilter = plugins.filter [gp.SCSS], restore: true<% } %>
  gulp.src [gp.CSS<% if (use.sass) { %>, gp.SASS, gp.SCSS<% } %>], cwd: "#{build.dirs.src.client}/styles"
    .pipe build.streams.plumber()
    .pipe plugins.template templateConfig<% if (use.sass) { %>
    .pipe sassFilter
    .pipe plugins.sass includePaths: includePaths, indentedSyntax: true
    .pipe sassFilter.restore
    .pipe scssFilter
    .pipe plugins.sass includePaths: includePaths
    .pipe scssFilter.restore<% } if (use.crusher) { %>
    .pipe build.crusher.pusher()<% } %>
    .pipe gulp.dest "#{build.dirs.tgt.client}/styles"
    .pipe build.streams.reloadClient()

<% if (use.modernizr) { -%>
gulp.task 'build-client-vendor-modernizr', ->
  build.modernizr build.config.modernizr
    .pipe gulp.dest "#{build.dirs.tgt.clientVendor}/modernizr"
<% } -%>

<% if (use.foundation) { -%>
gulp.task 'build-client-vendor-foundation-scripts', ->
  gulp.src ['foundation.js'], cwd: 'node_modules/foundation-sites/dist'
    .pipe gulp.dest "#{build.dirs.tgt.clientVendor}/foundation"

gulp.task 'build-client-vendor-foundation-fonts', ->
  gulp.src ['**/*.{eot,svg,ttf,woff}'], cwd: 'bower_components/foundation-icon-fonts'
    .pipe gulp.dest "#{build.dirs.tgt.clientVendor}/foundation/assets/fonts"
<% } -%>

<% if (use.bootstrap) { -%>
gulp.task 'build-client-vendor-bootstrap-fonts', ->
  gulp.src ['**/*'], cwd: 'node_modules/bootstrap-sass/assets/fonts'
    .pipe gulp.dest "#{build.dirs.tgt.clientVendor}/bootstrap/assets/fonts"
<% } -%>


gulp.task 'nop', ->

gulp.task 'build-client-vendor-assets', (done) ->
  runSequence [<% if (use.modernizr) { %>
    'build-client-vendor-modernizr'<% } %><% if (use.foundation) { %>
    'build-client-vendor-foundation-scripts'
    'build-client-vendor-foundation-fonts'<% } %><% if (use.bootstrap) { %>
    'build-client-vendor-bootstrap-fonts'<% } %>
    'nop'
  ], done

gulp.task 'build-test-server-scripts', ->
  dest = "#{build.dirs.tgt.server}/test/scripts"
  gulp.src gp.SCRIPT, cwd: "#{build.dirs.test.server}/scripts"
    .pipe build.streams.plumber()
    .pipe plugins.newer dest: dest, map: mapScript
    .pipe makeScriptPipe()
    .pipe gulp.dest dest
    .pipe build.streams.rerunMocha()

gulp.task 'hint-test-client-scripts', ->
  dest = "#{build.dirs.tgt.client}/test/scripts"
  destName = 'main.js'
  gulp.src gp.SCRIPT, cwd: "#{build.dirs.test.client}/scripts"
    .pipe build.streams.plumber()
    .pipe plugins.newer dest: "#{dest}/#{destName}"
    .pipe makeScriptPipe() # just hint & forget
    .resume()

gulp.task 'build-test-client-scripts', ['hint-test-client-scripts'], ->
  build.buildBrowsified build.getBundleDefs('test'), doWatch: build.watchEnabled

gulp.task 'pack', (done) ->
  child_process = require 'child_process'
  tar = child_process.spawn 'tar', [
    '-czf'
    'dist.tar.gz'
    'package.json'
    'server.js'
    build.dirs.tgt.root
  ]
  tar.on 'close', (code) ->
    if code
      done new Error "tar failed with code #{code}"
    else
      done()
    return
  return

gulp.task 'serve', (done) ->
  build.serverState.start done
  return

gulp.task 'bs', (done) ->
  browserSync
    proxy: "localhost:#{build.serverState.port}"
    browser: build.config.browserSync.browser
    done

gulp.task 'mocha', () ->
  build.mochaState.start()

gulp.task 'karma', (done) ->
  build.karmaState.start singleRun: true, ->
    build.serverState.stop(done)

gulp.task 'karma-watch', ->
  build.karmaState.start singleRun: false


gulp.task 'build-server-assets', (done) ->
  runSequence [
    'build-server-templates'
  ], done

gulp.task 'build-server', (done) ->
  runSequence [
    'build-server-scripts'
    'build-server-assets'
  ], done

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
    'build-test-server-scripts'
    'build-test-client-scripts'
  ], done

gulp.task 'build', (done) ->
  tasks = [
    'build-server'
    'build-client'
  ]
  if build.mode.isProduction
    tasks.push 'build-config'
    tasks.push 'build-starter'
  runSequence tasks, done


gulp.task 'watch-on', ->
  build.watchEnabled = true

gulp.task 'headless-on', ->
  build.headlessEnabled = true

<% if (use.crusher) { %>
gulp.task 'crush-on', ->
  build.crusher.enabled = true<% } %>

gulp.task 'watch-server-assets', ->
  gulp.watch ["#{build.dirs.src.server}/templates/#{gp.ALL}"], ['build-server-templates']

gulp.task 'watch-server-scripts', ->
  gulp.watch ["#{build.dirs.src.server}/scripts/#{gp.SCRIPT}"], ['build-server-scripts']

gulp.task 'watch-server', ['watch-server-assets', 'watch-server-scripts']

gulp.task 'watch-client-assets', ->
  gulp.watch ["#{build.dirs.src.client}/styles/#{gp.ALL}"], ['build-client-styles']
  gulp.watch ["#{build.dirs.src.client}/images/#{gp.ALL}"], ['build-client-images']
  gulp.watch ["#{build.dirs.src.client}/pages/#{gp.ALL}"], ['build-client-pages']

gulp.task 'watch-client-scripts', ->
  gulp.watch ["#{build.dirs.src.client}/scripts/#{gp.SCRIPT}"], ['hint-client-scripts']

gulp.task 'watch-test-server-scripts', ->
  gulp.watch ["#{build.dirs.test.server}/scripts/#{gp.SCRIPT}"], ['build-test-server-scripts']

gulp.task 'watch-test-client-scripts', ->
  gulp.watch ["#{build.dirs.test.client}/scripts/#{gp.SCRIPT}"], ['hint-test-client-scripts']

gulp.task 'watch-client', ['watch-client-assets', 'watch-client-scripts']

gulp.task 'watch', ['watch-server', 'watch-client']

gulp.task 'watch-test', ['watch-test-server-scripts', 'watch-test-client-scripts']

gulp.task 'run', (done) ->
  runSequence 'clean', 'build', 'serve', done

gulp.task 'run-watch', (done) ->
  runSequence 'watch-on', 'clean', 'build', ['serve', 'bs'], 'watch', done

gulp.task 'test', (done) ->
  runSequence <% if (use.crusher) { %>'crush-on', <% } %>'clean', 'build-test', ['serve', 'mocha', 'karma'], done

gulp.task 'test-ci', (done) ->
  runSequence <% if (use.crusher) { %>'crush-on', <% } %>'headless-on', 'clean', 'build-test', 'serve', 'mocha', 'karma', done

gulp.task 'test-watch', (done) ->
  runSequence 'watch-on', 'clean', 'build-test', ['serve', 'mocha', 'karma-watch'], ['watch-server', 'watch-client-assets', 'watch-test'], done

gulp.task 'dist', (done) ->
  runSequence <% if (use.crusher) { %>'crush-on', <% } %>'clean', 'build', 'pack', done

gulp.task 'default', ['run-watch']

