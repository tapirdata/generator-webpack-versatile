'use strict'
path = require('path')
_ = require('lodash')
yeoman = require('yeoman-generator')
coffeeScript = require('coffee-script')
BranchFinder = require('./branch-finder')

BaseGenerator = yeoman.generators.Base.extend(
  _getBranches: ->
    use = @config.get('use')
    {
      backbone: use.backbone
      bootstrap: use.bootstrap
      requirejs: use.amd == 'requirejs'
      curl: use.amd == 'curl'
      coffee: use.coffee
      sass: use.sass
    }
  _transformerMakers:
    template: ->
      self = this
      {
        name: 'template'
        src: /^%(.*)/
        tgt: '$1'
        fn: (s) ->
          self.engine s, self.config.getAll()

      }
    decoffee: ->
      self = this
      {
        name: 'decoffee'
        src: /(.*).coffee$/
        tgt: '$1.js'
        fn: (s) ->
          coffeeScript.compile s, bare: true

      }
  _getTransformers: (names) ->
    transformers = []
    _.forEach names, ((name) ->
      transformers.push @_transformerMakers[name].apply(this)
      return
    ), this
    transformers
  _copyOp: (srcPath, tgtPath, transFns) ->
    # console.log('op srcPath=', srcPath, 'opOptions=', opOptions);
    copyOptions = {}
    if transFns and transFns.length

      copyOptions.process = (contents) ->
        s = contents.toString()
        _.forEach transFns, (transFn) ->
          s = transFn(s)
          return
        s

    @fs.copy srcPath, tgtPath, copyOptions
    return
  _branchCopy: (source, target, pattern) ->
    transNames = [ 'template' ]
    if !@config.get('use').coffee
      transNames.push 'decoffee'
    srcBase = @sourceRoot()
    tgtBase = target or ''
    pattern = pattern or '**/*'
    _options = 
      pattern: path.join(source, pattern)
      tgtRelalative: source
      branches: @_getBranches()
      transformers: @_getTransformers(transNames)
      op: @_copyOp.bind(this)
    bf = new BranchFinder(srcBase, tgtBase, _options)
    bf.run()
    return
  _initConfig: ->
    config = @config
    config.defaults
      appname: @appname
      dirs: {}
      use: {}
    return
  _optionConfig: ->
    config = @config
    options = @options
    dirs = config.get('dirs')
    config.set 'dirs', _.defaults(dirs,
      bower: options['bower-dir']
      src: options['src-dir']
      serverSrc: options['server-src-dir']
      clientSrc: options['client-src-dir']
      test: options['test-dir']
      tmp: options['tmp-dir']
      tmpDev: options['tmp-dev-dir']
      tmpTest: options['tmp-test-dir']
      dist: options['dist-dir'])
    #TODO: set 'use'
    return
  _defaultConfig: ->
    config = @config
    dirs = undefined
    use = undefined
    dirs = config.get('dirs')
    config.set 'dirs', _.defaults(dirs,
      bower: 'bower_components'
      src: 'src'
      test: 'test'
      tmp: '.tmp'
      dist: 'dist')
    dirs = config.get('dirs')
    config.set 'dirs', _.defaults(dirs,
      serverSrc: path.join(dirs.src, 'server')
      clientSrc: path.join(dirs.src, 'client')
      tmpDev: path.join(dirs.tmp, 'dev')
      tmpTest: path.join(dirs.tmp, 'test'))
    use = config.get('use')
    config.set 'use', _.defaults(use,
      backbone: true
      bootstrap: true
      modernizr: true
      coffee: true
      sass: true
      amd: 'curl')
    return
  constructor: ->
    yeoman.generators.Base.apply this, arguments
    @pkg = require('../../package.json')
    @_initConfig()
    @_optionConfig()
    @_defaultConfig()
    # console.log '..config=', @config.getAll()
    return
)
module.exports = BaseGenerator
