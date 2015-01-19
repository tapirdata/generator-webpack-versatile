'use strict';

var path = require('path');
var fs = require('fs');
var minimatch = require('minimatch');

var BranchFinder = function(srcBase, tgtBase, options) {
  this.srcBase = srcBase;
  this.tgtBase = tgtBase;
  options = options || {};
  this.pattern = options.pattern || '**/*';
  this.branches = options.branches || {};
  this.reBranch = options.reBranch || /^\.if-(no-)?(\w+)$/;
  this.op = options.op || this.dummyOp.bind(this);
  this.tgtRelalative = options.tgtRelalative || '';
  this.replacer = options.replacer;
}


BranchFinder.prototype.replaceName = function(srcName, opOptions) {
  if (this.replacer) {
    return this.replacer(srcName, opOptions);
  } else {
    return srcName
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
      var opOptions = {};
      var tgtName = this.replaceName(srcName, opOptions);
      var tgtOk = minimatch(path.join(tgt, tgtName), this.pattern, {dot: true});
      if (tgtOk) {
        var tgtPath = path.join(this.tgtBase, path.relative(this.tgtRelalative, tgt), tgtName);
        this.op(srcPath, tgtPath, opOptions);
      }  
    } else if (srcStat.isDirectory()) {
      var m = srcName.match(this.reBranch);
      if (m) {
        var setNot = m[1];
        var setName = m[2];
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
    replacer: function(srcName) {return srcName + '.bak'}
  });
  bf.run();
}  

module.exports = BranchFinder;


