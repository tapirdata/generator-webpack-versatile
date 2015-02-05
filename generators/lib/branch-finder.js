'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var minimatch = require('minimatch');

var BranchFinder = function(srcBase, tgtBase, options) {
  this.srcBase = srcBase;
  this.tgtBase = tgtBase;
  options = options || {};
  this.pattern = options.pattern || '**/*';
  this.branches = options.branches || {};
  this.reBranch = options.reBranch || /^\.if-(\w+)(-no)?$/;
  this.op = options.op || this.dummyOp.bind(this);
  this.tgtRelalative = options.tgtRelalative || '';
  this.transformers = options.transformers || [];
}


BranchFinder.prototype.getTi = function(srcName, opOptions) {
  var tgtName = srcName;
  var transFns = [];
  _.forEach(this.transformers, function(transformer) {
    if (tgtName.match(transformer.src)) {
      tgtName = srcName.replace(transformer.src, transformer.tgt);
      if (transformer.fn) {
        transFns.push(transformer.fn);
      }  
      srcName = tgtName;
    }
  });
  return {
    tgtName: tgtName,
    transFns: transFns
  }
}

BranchFinder.prototype.run = function(src, tgt) {
  src = src || '';
  tgt = tgt || '';
  var names = fs.readdirSync(path.join(this.srcBase, src));
  names.forEach(function(srcName) {
    var srcNext = path.join(src, srcName);
    var srcPath = path.join(this.srcBase, srcNext);
    var srcStat = fs.statSync(srcPath);
    if (srcStat.isFile()) {
      if (srcName === '.unsupported') {
        var msg = fs.readFileSync(srcPath);
        throw new Error(msg);
      }
      var ti = this.getTi(srcName);
      var tgtName = ti.tgtName;
      console.log('%s -> %s', srcName, tgtName);
      var tgtOk = minimatch(path.join(tgt, tgtName), this.pattern, {dot: true});
      if (tgtOk) {
        var tgtPath = path.join(this.tgtBase, path.relative(this.tgtRelalative, tgt), tgtName);
        this.op(srcPath, tgtPath, ti.transFns);
      }  
    } else if (srcStat.isDirectory()) {
      var m = srcName.match(this.reBranch);
      if (m) {
        var setName = m[1];
        var setNot  = m[2];
        if (!!this.branches[setName] === !setNot) {
          this.run(srcNext, tgt);
        }
      } else {
        this.run(srcNext, path.join(tgt, srcName));
      }  
    }   
  }, this);
}

BranchFinder.prototype.dummyOp = function(srcPath, tgtPath) {
  console.log('op', srcPath, '->', tgtPath);
}

if (0) {

  var bf = new BranchFinder('templates', '/tmp/ho-srv', {
    branches: {
      backbone: true,
      requirejs: true
    },
    pattern: 'server/**/*',
    tgtRelalative: 'server',
    transformers: [
      {
        name: 'backup',
        src: /(.*)/,
        tgt: '$1.bak',
      }
    ]
  });
  bf.run();
}  

module.exports = BranchFinder;


