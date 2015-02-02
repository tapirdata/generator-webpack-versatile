'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var _ = require('underscore');
var BranchFinder = require('./lib/branch-finder');

var ExpressDevelopGenerator = yeoman.generators.Base.extend({

  _setupBranches: function() {
    var settings = this.settings;
    this.activeBranches = {
      backbone:  settings.includeBackbone,
      bootstrap: settings.includeBootstrap,
      requirejs: settings.includeRequireJS,
      sass:      settings.includeSass,
    };
  },

  _branchCopy: function (source, target, pattern) {
    var self = this;
    var srcBase = this.sourceRoot();
    var tgtBase = target || '';
    pattern = pattern || '**/*';
    var _options = {
      pattern: path.join(source, pattern),
      tgtRelalative: source,
      branches: this.activeBranches, 
      replacer: function(srcName, opOptions) {
        var m = srcName.match(/^(%)?(.*)/);
        if (m) {
          opOptions.tpl = m[1] === '%';
          return m[2];
        } else {
          return srcName;
        }
      },
      op: function(srcPath, tgtPath, opOptions) {
        // console.log('op srcPath=', srcPath, 'opOptions=', opOptions);
        var copyOptions = {};
        if (opOptions.tpl) {
         copyOptions.process = function(contents) {
           return self.engine(contents.toString(), self.settings); 
         }
        }
        self.fs.copy(srcPath, tgtPath, copyOptions);
      }
    }
    var bf = new BranchFinder(srcBase, tgtBase, _options);
    bf.run();
  },

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.pkg = require('../../package.json');

    _.defaults(this.options, {
      // 'test-framework': 'mocha',
      'bower-dir':    'bower_components',
      'src-dir':      'src',
      'test-dir':     'test',
      'tmp-dev-dir':  '.tmp/dev',
      'tmp-test-dir': '.tmp/test',
      'dist-dir':     'dist'
    });

    _.defaults(this.options, {
      'server-src-dir':  path.join(this.options['src-dir'], 'server'),
      'client-src-dir':  path.join(this.options['src-dir'], 'client')
    });

    this.settings = {
      appname:      this.appname,
      bowerDir:     this.options['bower-dir'],
      serverSrcDir: this.options['server-src-dir'],
      clientSrcDir: this.options['client-src-dir'],
      testDir:      this.options['test-dir'],
      tmpDevDir:    this.options['tmp-dev-dir'],
      tmpTestDir:   this.options['tmp-test-dir'],
      distDir:      this.options['dist-dir']
    };  
  },

  prompting: {
    askFor: function () {
      var done = this.async();

      if (!this.options['skip-welcome-message']) {
        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the marvelous ExpressDevelop generator!'));
      }

      var prompts = [{
        type: 'checkbox',
        name: 'features',
        message: 'What more would you like?',
        choices: [{
          name: 'Backbone',
          value: 'includeBackbone',
          checked: true
        },{
          name: 'Bootstrap',
          value: 'includeBootstrap',
          checked: true
        },{
          name: 'Modernizr',
          value: 'includeModernizr',
          checked: true
        },{
          name: 'RequireJS',
          value: 'includeRequireJS',
          checked: true
        },{
          name: 'Sass',
          value: 'includeSass',
          checked: true
        }]
      }, {
        when: function (answers) {
          return answers.features.indexOf('includeSass') !== -1;
        },
        type: 'confirm',
        name: 'libsass',
        value: 'includeLibSass',
        message: 'Would you like to use libsass? Read up more at \n' + chalk.green('https://github.com/andrew/node-sass#reporting-sass-compilation-and-syntax-issues'),
        default: false
      }];

      this.prompt(prompts, function (answers) {
        function hasFeature(feat) { return answers.features.indexOf(feat) !== -1; }

        var settings = this.settings;
        settings.includeSass = hasFeature('includeSass');
        settings.includeBootstrap = hasFeature('includeBootstrap');
        settings.includeModernizr = hasFeature('includeModernizr');
        settings.includeBackbone = hasFeature('includeBackbone');
        settings.includeRequireJS = hasFeature('includeRequireJS');

        settings.includeLibSass = answers.libsass;
        settings.includeRubySass = !(answers.libsass);

        try {
          this._setupBranches();
        } catch (e) {
          this.log(chalk.red('Unsupported options: ') + e.message);
          process.exit(0);
        }  

        done();
      }.bind(this));
    }
  },

  configuring: {
  },

  writing: {

    projectFiles: function () {
      console.log('copy project files');
      this._branchCopy('root');
    },

    serverFiles: function () {
      console.log('copy server files');
      this._branchCopy('server', this.settings.serverSrcDir);
    },

    clientfiles: function () {
      console.log('copy client files');
      this._branchCopy('client', this.settings.clientSrcDir);
    },

    testfiles: function () {
      console.log('copy test files');
      this._branchCopy('test', this.settings.testDir);
    },


  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  },

});

module.exports = ExpressDevelopGenerator;
