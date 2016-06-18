'use strict'
path = require 'path'
_ = require 'lodash'
slug = require 'slug'
yeoman = require 'yeoman-generator'
coffeeScript = require 'coffee-script'
ejs = require 'ejs'

BranchFinder = require './branch-finder'


BaseGenerator = yeoman.Base.extend

  _getBranches: ->
    use = @config.get 'use'
    modernizr: use.modernizr
    foundation: use.foundation
    bootstrap: use.bootstrap
    backbone: use.backbone
    coffee: use.coffee
    sass: use.sass
    crusher: use.crusher

  _transformerMakers:
    template: ->
      name: 'template'
      src: /^%(.*)/
      tgt: '$1'
      fn: (s) =>
        ejs.render s, @config.getAll()
    decoffee: ->
      name: 'decoffee'
      src: /(.*).coffee$/
      tgt: '$1.js'
      fn: (s) ->
        coffeeScript.compile s, bare: true

  _getTransformers: (names) ->
    transformers = []
    for name in names
      transformers.push @_transformerMakers[name].apply @
    transformers

  _copyOp: (srcPath, tgtPath, transFns) ->
    # console.log "op srcPath=#{srcPath} transFns=#{transFns}"
    copyOptions = {}
    if transFns and transFns.length
      copyOptions.process = (contents) ->
        s = contents.toString()
        for transFn in transFns
          s = transFn s
        s

    @fs.copy srcPath, tgtPath, copyOptions
    return

  _branchCopy: (source, target, pattern) ->
    # console.log "_branchCopy source=#{source} target=#{target} pattern=#{pattern}"
    transNames = ['template']
    if !@config.get('use').coffee
      transNames.push 'decoffee'
    srcBase = @sourceRoot()
    tgtBase = target or ''
    pattern = pattern or '**/*'
    _options = 
      pattern: path.join source, pattern
      tgtRelalative: source
      branches: @_getBranches()
      transformers: @_getTransformers transNames
      op: @_copyOp.bind @
    bf = new BranchFinder srcBase, tgtBase, _options
    bf.run()
    return

  _initConfig: ->
    config = @config
    config.defaults
      appname: @appname
      appnameSlug: slug @appname
      appnameCap: _.capitalize @appname
      dirs: {}
      use: {}
    return

  _optionConfig: ->
    config = @config
    options = @options
    dirs = config.get 'dirs'
    config.set 'dirs', _.defaults dirs,
      bower: options['bower-dir']
      src: options['src-dir']
      serverSrc: options['server-src-dir']
      clientSrc: options['client-src-dir']
      test: options['test-dir']
      tmp: options['tmp-dir']
      tmpDev: options['tmp-dev-dir']
      tmpTest: options['tmp-test-dir']
      dist: options['dist-dir']
    #TODO: set 'use'
    return

  _defaultConfig: ->
    config = @config
    dirs = undefined
    use = undefined
    dirs = config.get 'dirs'
    config.set 'dirs', _.defaults dirs,
      bower: 'bower_components'
      src: 'src'
      test: 'test'
      tmp: '.tmp'
      dist: 'dist'
    dirs = config.get 'dirs'
    config.set 'dirs', _.defaults dirs,
      serverSrc: path.join dirs.src, 'server'
      clientSrc: path.join dirs.src, 'client'
      tmpDev: path.join dirs.tmp, 'dev'
      tmpTest: path.join dirs.tmp, 'test'
    use = config.get 'use'
    config.set 'use', _.defaults use,
      backbone: true
      foundation: true
      bootstrap: false
      modernizr: true
      coffee: true
      sass: true
      crusher: true
    return

  constructor: ->
    yeoman.Base.apply @, arguments
    @pkg = require '../../package.json'
    @_initConfig()
    @_optionConfig()
    @_defaultConfig()
    # console.log "..config=#{JSON.stringify(@config.getAll())}"
    return


module.exports = BaseGenerator
