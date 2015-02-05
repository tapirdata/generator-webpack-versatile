'use strict';

var path = require('path');
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var coffeeScript = require('coffee-script');


var BranchFinder = require('./branch-finder');

var BaseGenerator = yeoman.generators.Base.extend({

  _getBranches: function() {
    var use = this.config.get('use');
    return {
      backbone:  use.backbone,
      bootstrap: use.bootstrap,
      requirejs: use.amd === 'requirejs',
      curl:      use.amd === 'curl',
      coffee:    use.coffee,
      sass:      !!use.sass,
    };
  },

  _transformerMakers: {
    template: function() {
      var self = this;
      return {
        name: 'template',
        src: /^%(.*)/,
        tgt: '$1',
        fn: function(s) {
          return self.engine(s, self.config.getAll());
        }
      }
    },
    decoffee: function() {
      var self = this;
      return {
        name: 'decoffee',
        src: /(.*).coffee$/,
        tgt: '$1.js',
        fn: function(s) {
          return coffeeScript.compile(s, {
            bare: true
          });
        }
      }
    }
  },

  _getTransformers: function (names) {
    var transformers = [];
    _.forEach(names, function(name) {
      transformers.push(this._transformerMakers[name].apply(this));
    }, this);
    return transformers;
  },

  _copyOp: function(srcPath, tgtPath, transFns) {
    // console.log('op srcPath=', srcPath, 'opOptions=', opOptions);
    var copyOptions = {};
    if (transFns && transFns.length) {
      copyOptions.process = function(contents) {
        var s = contents.toString();
        _.forEach(transFns, function(transFn) {
          s = transFn(s);
        });
        return s;
      }
    }
    this.fs.copy(srcPath, tgtPath, copyOptions);
  },

  _branchCopy: function (source, target, pattern) {
    var transNames = ['template'];
    if (!this.config.get('use').coffee) {
      transNames.push('decoffee');
    }
    var srcBase = this.sourceRoot();
    var tgtBase = target || '';
    pattern = pattern || '**/*';
    var _options = {
      pattern: path.join(source, pattern),
      tgtRelalative: source,
      branches: this._getBranches(),
      transformers: this._getTransformers(transNames),
      op: this._copyOp.bind(this)
    }
    var bf = new BranchFinder(srcBase, tgtBase, _options);
    bf.run();
  },

  _initConfig: function () {
    var config = this.config;
    config.defaults({
      appname:      this.appname,
      dirs:         {},
      use:          {}
    });
  },

  _optionConfig: function () {
    var config = this.config;
    var options = this.options;

    var dirs = config.get('dirs');
    config.set('dirs', _.defaults(dirs, {
        bower:     options['bower-dir'],
        serverSrc: options['server-src-dir'],
        clientSrc: options['client-src-dir'],
        test:      options['test-dir'],
        tmp:       options['tmp-dir'],
        tmpDev:    options['tmp-dev-dir'],
        tmpTest:   options['tmp-test-dir'],
        dist:      options['dist-dir']
    }));
    //TODO: set 'use'
  },

  _defaultConfig: function () {
    var config = this.config;
    var dirs;
    var use;

    dirs = config.get('dirs');
    config.set('dirs', _.defaults(dirs, {
      bower:    'bower_components',
      src:      'src',
      test:     'test',
      tmp:      '.tmp',
      dist:     'dist'
    }));

    dirs = config.get('dirs');
    config.set('dirs', _.defaults(dirs, {
      serverSrc:  path.join(dirs.src, 'server'),
      clientSrc:  path.join(dirs.src, 'client'),
      tmpDev:     path.join(dirs.tmp, 'dev'),
      tmpTest:    path.join(dirs.tmp, 'test')
    }));

    use = config.get('use');
    config.set('use', _.defaults(use, {
      backbone:  true,
      bootstrap: true,
      modernizr: true,
      coffee:    true,
      sass:      'ruby',
      amd:       'curl',
    }));
  },

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.pkg = require('../../package.json');
    this._initConfig();
    this._optionConfig();
    this._defaultConfig();
    console.log('..config=', this.config.getAll());
  }

});

module.exports = BaseGenerator;


