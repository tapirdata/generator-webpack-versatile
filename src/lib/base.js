import path from 'path';
import _ from 'lodash';
import slug from 'slug';
import yeoman from 'yeoman-generator';
import ejs from 'ejs';

import BranchFinder from './branch-finder';


let BaseGenerator = yeoman.Base.extend({

  _getBranches() {
    let use = this.config.get('use');
    return {
      modernizr: use.modernizr,
      foundation: use.foundation,
      bootstrap: use.bootstrap,
      backbone: use.backbone,
      marionette: use.marionette,
      sass: use.sass,
      crusher: use.crusher,
      coffee: use.coffee
    };
  },

  _transformerMakers: {
    template() {
      return {
        name: 'template',
        src: /^%(.*)/,
        tgt: '$1',
        fn: s => {
          return ejs.render(s, this.config.getAll());
        }
      };
    }
  },

  _getTransformers(names) {
    let transformers = [];
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      transformers.push(this._transformerMakers[name].apply(this));
    }
    return transformers;
  },

  _copyOp(srcPath, tgtPath, transFns) {
    // console.log "op srcPath=#{srcPath} transFns=#{transFns}"
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
  },

  _branchCopy(source, target, pattern) {
    // console.log "_branchCopy source=#{source} target=#{target} pattern=#{pattern}"
    let transNames = ['template'];
    let srcBase = this.sourceRoot();
    let tgtBase = target || '';
    pattern = pattern || '**/*';
    let _options = { 
      pattern: path.join(source, pattern),
      tgtRelalative: source,
      branches: this._getBranches(),
      transformers: this._getTransformers(transNames),
      op: this._copyOp.bind(this)
    };
    let bf = new BranchFinder(srcBase, tgtBase, _options);
    bf.run();
  },

  _initConfig() {
    let { config } = this;
    config.defaults({
      appname: this.appname,
      appnameSlug: slug(this.appname),
      appnameCap: _.capitalize(this.appname),
      dirs: {},
      use: {}});
  },

  _optionConfig() {
    let { config } = this;
    let { options } = this;
    let dirs = config.get('dirs');
    config.set('dirs', _.defaults(dirs, {
      bower: options['bower-dir'],
      src: options['src-dir'],
      serverSrc: options['server-src-dir'],
      clientSrc: options['client-src-dir'],
      test: options['test-dir'],
      tmp: options['tmp-dir'],
      tmpDev: options['tmp-dev-dir'],
      tmpTest: options['tmp-test-dir'],
      dist: options['dist-dir']
    }));
    //TODO: set 'use'
  },

  _defaultConfig() {
    let { config } = this;
    let dirs = undefined;
    let use = undefined;
    dirs = config.get('dirs');
    config.set('dirs', _.defaults(dirs, {
      bower: 'bower_components',
      src: 'src',
      test: 'test',
      tmp: '.tmp',
      dist: 'dist'
    }
    )
    );
    dirs = config.get('dirs');
    config.set('dirs', _.defaults(dirs, {
      serverSrc: path.join(dirs.src, 'server'),
      clientSrc: path.join(dirs.src, 'client'),
      tmpDev: path.join(dirs.tmp, 'dev'),
      tmpTest: path.join(dirs.tmp, 'test')
    }
    )
    );
    use = config.get('use');
    config.set('use', _.defaults(use, {
      backbone: true,
      marionette: true,
      foundation: true,
      bootstrap: false,
      modernizr: true,
      coffee: true,
      sass: true,
      crusher: true
    }
    )
    );
  },

  constructor() {
    yeoman.Base.apply(this, arguments);
    this.pkg = require('../../package.json');
    this._initConfig();
    this._optionConfig();
    this._defaultConfig();
    // console.log "..config=#{JSON.stringify(@config.getAll())}"
  }
});


export default BaseGenerator;
