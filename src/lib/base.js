import path from 'path';
import yeoman from 'yeoman-generator';
import ejs from 'ejs';

import BranchFinder from './branch-finder';


class BaseGenerator extends yeoman.Base {

  constructor(...args) {
    super(...args);
  }

  _make_template_transformer() {
    return {
      name: 'template',
      src: /^%(.*)/,
      tgt: '$1',
      fn: s => {
        return ejs.render(s, this.config.getAll());
      }
    };
  }

  _getTransformers(names) {
    let transformers = [];
    for (const name of names) {
      const makerName = `_make_${name}_transformer`;
      const maker = this[makerName];
      transformers.push(maker.apply(this));
    }
    return transformers;
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
    const transNames = opt.transNames || ['template'];
    const pattern = opt.pattern || '**/*';
    const branches = opt.branches || {};
    const srcBase = this.sourceRoot();
    let _options = {
      pattern: path.join(source, pattern),
      tgtRelalative: source,
      branches: branches,
      transformers: this._getTransformers(transNames),
      op: this._copyOp.bind(this)
    };
    let bf = new BranchFinder(srcBase, tgtBase, _options);
    bf.run();
  }


};


export default BaseGenerator;
