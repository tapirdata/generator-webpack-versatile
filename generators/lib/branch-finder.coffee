'use strict'

path = require 'path'
fs = require 'fs'
_ = require 'lodash'
minimatch = require 'minimatch'

class BranchFinder

  constructor: (srcBase, tgtBase, options) ->
    @srcBase = srcBase
    @tgtBase = tgtBase
    options = options or {}
    @pattern = options.pattern or '**/*'
    @branches = options.branches or {}
    @reBranch = options.reBranch or /^\.if-(\w+)(-no)?$/
    @op = options.op or @dummyOp.bind @
    @tgtRelalative = options.tgtRelalative or ''
    @transformers = options.transformers or []

  getTi: (srcName, opOptions) ->
    tgtName = srcName
    transFns = []
    for transformer in  @transformers
      if tgtName.match(transformer.src)
        tgtName = srcName.replace transformer.src, transformer.tgt
        if transformer.fn
          transFns.push transformer.fn
        srcName = tgtName
    tgtName: tgtName
    transFns: transFns

  run: (src, tgt) ->
    src = src or ''
    tgt = tgt or ''
    names = fs.readdirSync path.join @srcBase, src
    for srcName in names
      srcNext = path.join src, srcName
      srcPath = path.join @srcBase, srcNext
      srcStat = fs.statSync srcPath
      if srcStat.isFile()
        if srcName == '.unsupported'
          msg = fs.readFileSync srcPath
          throw new Error msg 
        ti = @getTi srcName
        tgtName = ti.tgtName
        # console.log '%s -> %s', srcName, tgtName
        tgtOk = minimatch path.join(tgt, tgtName), @pattern, dot: true
        if tgtOk
          tgtPath = path.join @tgtBase, path.relative(@tgtRelalative, tgt), tgtName
          @op srcPath, tgtPath, ti.transFns
      else if srcStat.isDirectory()
        m = srcName.match @reBranch
        if m
          setName = m[1]
          setNot = m[2]
          if !!@branches[setName] == !setNot
            @run srcNext, tgt
        else
          @run srcNext, path.join tgt, srcName
    return

BranchFinder::dummyOp = (srcPath, tgtPath) ->
  console.log 'op', srcPath, '->', tgtPath
  return

if 0
  bf = new BranchFinder __dirname + '/../app/templates', '/tmp/ho-srv',
    branches:
      backbone: true
      requirejs: true
    pattern: 'server/**/*'
    tgtRelalative: 'server'
    transformers: [
      name: 'backup'
      src: /(.*)/
      tgt: '$1.bak'
    ] 
  bf.run()

module.exports = BranchFinder
