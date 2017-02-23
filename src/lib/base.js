import path from 'path';
import Generator from 'yeoman-generator';

import BranchFinder from './branch-finder';


class BaseGenerator extends Generator {

  constructor(...args) {
    super(...args);
  }

  _copyOp(srcPath, tgtPath, transFns) {
    let copyOptions = {};
    if (transFns && transFns.length) {
      copyOptions.process = function(contents) {
        let s = contents.toString();
        for (let i = 0; i < transFns.length; i++) {
          let transFn = transFns[i];
          s = transFn(s);
        }
        return s;
      };
    }
    this.fs.copy(srcPath, tgtPath, copyOptions);
  }

  _branchCopy(opt) {
    const source = opt.source;
    const tgtBase = opt.target || '';
    const transformers = opt.transformers || [];
    const pattern = opt.pattern || '**/*';
    const branches = opt.branches || {};
    const srcBase = this.sourceRoot();
    let _options = {
      pattern: path.join(source, pattern),
      tgtRelalative: source,
      branches: branches,
      transformers: transformers,
      op: this._copyOp.bind(this)
    };
    let bf = new BranchFinder(srcBase, tgtBase, _options);
    bf.run();
  }


}


export default BaseGenerator;
