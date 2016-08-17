import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import minimatch from 'minimatch';

class BranchFinder {

  constructor(srcBase, tgtBase, options) {
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

  getTi(srcName, opOptions) {
    let tgtName = srcName;
    let transFns = [];
    for (let i = 0; i < this.transformers.length; i++) {
      let transformer = this.transformers[i];
      if (tgtName.match(transformer.src)) {
        tgtName = srcName.replace(transformer.src, transformer.tgt);
        if (transformer.fn) {
          transFns.push(transformer.fn);
        }
        srcName = tgtName;
      }
    }
    return {
      tgtName,
      transFns
    };
  }

  run(src, tgt) {
    src = src || '';
    tgt = tgt || '';
    let names = fs.readdirSync(path.join(this.srcBase, src));
    for (let i = 0; i < names.length; i++) {
      let srcName = names[i];
      let srcNext = path.join(src, srcName);
      let srcPath = path.join(this.srcBase, srcNext);
      let srcStat = fs.statSync(srcPath);
      if (srcStat.isFile()) {
        if (srcName === '.unsupported') {
          let msg = fs.readFileSync(srcPath);
          throw new Error(msg); 
        }
        let ti = this.getTi(srcName);
        let { tgtName } = ti;
        // console.log '%s -> %s', srcName, tgtName
        let tgtOk = minimatch(path.join(tgt, tgtName), this.pattern, {dot: true});
        if (tgtOk) {
          let tgtPath = path.join(this.tgtBase, path.relative(this.tgtRelalative, tgt), tgtName);
          this.op(srcPath, tgtPath, ti.transFns);
        }
      } else if (srcStat.isDirectory()) {
        let m = srcName.match(this.reBranch);
        if (m) {
          let setName = m[1];
          let setNot = m[2];
          if (!!this.branches[setName] === !setNot) {
            this.run(srcNext, tgt);
          }
        } else {
          this.run(srcNext, path.join(tgt, srcName));
        }
      }
    }
  }
}

BranchFinder.prototype.dummyOp = function(srcPath, tgtPath) {
  console.log('op', srcPath, '->', tgtPath);
};

if (0) {
  let bf = new BranchFinder(__dirname + '/../app/templates', '/tmp/ho-srv', {
    branches: {
      backbone: true,
      requirejs: true
    },
    pattern: 'server/**/*',
    tgtRelalative: 'server',
    transformers: [{
      name: 'backup',
      src: /(.*)/,
      tgt: '$1.bak'
    }] 
  });
  bf.run();
}

export default BranchFinder;
