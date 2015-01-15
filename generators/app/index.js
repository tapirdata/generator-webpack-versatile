'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var _ = require('underscore');


var ExpressDevelopGenerator = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.pkg = require('../../package.json');

    _.defaults(this.options, {
      // 'test-framework': 'mocha',
      'app-dir':     'app',
      'static-dir':  '.tmp/static',
      'bower-dir':   'bower_components',
      'dist-dir':    'dist'
    });

    _.defaults(this.options, {
      'client-dir':  path.join('client')
    });

    _.defaults(this.options, {
      'templates-dir':  path.join(this.options['client-dir'], 'templates')
    });

    this.appDir       = this.options['app-dir'];
    this.staticDir    = this.options['static-dir'];
    this.distDir      = this.options['dist-dir'];
    this.bowerDir     = this.options['bower-dir'];
    this.clientDir    = this.options['client-dir'];
    this.templatesDir = this.options['templates-dir'];
  },

  initializing: function () {
    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  _setupBranches: function() {
    var branches = ['default'];

    function pushAll(name, ok) {
      if (!ok)
        name = 'no' + name;
      for (var i=0, l=branches.length; i<l; ++i)
      {
        var branch = branches[i];
        branch = (branch === 'default') ? name : branch + '+' + name; 
        branches.push(branch);
      }
    }
    pushAll('backbone', this.includeBackbone);
    pushAll('bootstrap', this.includeBootstrap);
    pushAll('requirejs', this.includeRequireJS);
    pushAll('sass', this.includeSass);
    branches.reverse();
    var src = this.src;
    branches = _.filter(branches, function(branch) {
      if (!src.isDir('branches', branch))
        return false;
      if (src.isFile('branches', branch, '.unsupported')) {
        var msg = src.read(path.join('branches', branch, '.unsupported'));
        throw new Error(branch + ': ' + msg);
      }
      return true;
    });
    // this.log('branches=', branches);
    this.activeBranches = branches;
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

        this.includeSass = hasFeature('includeSass');
        this.includeBootstrap = hasFeature('includeBootstrap');
        this.includeModernizr = hasFeature('includeModernizr');
        this.includeBackbone = hasFeature('includeBackbone');
        this.includeRequireJS = hasFeature('includeRequireJS');

        this.includeLibSass = answers.libsass;
        this.includeRubySass = !(answers.libsass);

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

  _mkdirs: function (base, names) {
    for (var i=0; i<names.length; ++i) {
      var name = names[i];
      this.mkdir(path.join(base, name));
    }
  },

  _branchCopy: function (source, destination, process) {
    for (var i=0, l=this.activeBranches.length; i<l; ++i) {
      var branch = this.activeBranches[i];
      var branchSource = path.join('branches', branch, source);
      // this.log('_branchCopy branchSource=' + branchSource);
      if (this.src.isFile(branchSource)) {
        // this.log('_branchCopy branchSource=' + branchSource + ' OK');
        return this.copy(branchSource, destination, process);
      }  
    }
  },

  _branchDirectory: function (source, destination, process) {
    for (var i=0, l=this.activeBranches.length; i<l; ++i) {
      var branch = this.activeBranches[i];
      var branchSource = path.join('branches', branch, source);
      if (this.src.isDir(branchSource)) {
        this.directory(branchSource, destination, process);
      }  
    }
  },

  configuring: {
  },

  writing: {

    gruntfile: function () {
      console.log('copy gruntfile');
      this._branchCopy('Gruntfile.js', 'Gruntfile.js', function(gruntfile){
        return gruntfile;
      });
    },

    projectfiles: function () {
      console.log('copy projectfiles');
      this._branchCopy('editorconfig', '.editorconfig');
      this._branchCopy('jshintrc', '.jshintrc');
      this._branchCopy('gitignore', '.gitignore');
      this._branchCopy('bowerrc', '.bowerrc');
    },

    pkgfiles: function () {
      console.log('copy pkgfiles');
      this._branchCopy('_package.json', 'package.json');
      this._branchCopy('_bower.json', 'bower.json');
    },

    appdirs: function () {
      console.log('make appdirs');
      var appDir = this.appDir;
      var clientDir = this.clientDir;
      this.mkdir(appDir);
      this._mkdirs(appDir, ['views', 'routes']);
      this._mkdirs(clientDir, ['styles', 'scripts', 'images', 'pages', 'templates']);
      this._mkdirs(this.staticDir, ['styles', 'scripts', 'images', 'pages']);
    },

    appfiles: function () {
      var appDir = this.appDir;
      var clientDir = this.clientDir;
      this._branchCopy(path.join('app', 'app-factory.js'), path.join(appDir, 'app-factory.js'));
      this._branchCopy(path.join('app', 'startapp.js'), path.join(appDir, 'startapp.js'));

      this._branchDirectory(path.join('app', 'routes'), path.join(appDir, 'routes'));
      this._branchDirectory(path.join('app', 'views'), path.join(appDir, 'views'));
    },

    clientfiles: function () {
      var clientDir = this.clientDir;
      this._branchDirectory(path.join('client', 'styles'), path.join(clientDir, 'styles'));
      this._branchDirectory(path.join('client', 'scripts'), path.join(clientDir, 'scripts'));
      this._branchDirectory(path.join('client', 'images'), path.join(clientDir, 'images'));
      this._branchDirectory(path.join('client', 'pages'), path.join(clientDir, 'pages'));
      this._branchDirectory(path.join('client', 'templates'), path.join(clientDir, 'templates'));
    },


    // gruntfile: function () {
    //   console.log('adapt gruntfile');
    //   console.log('gruntfile=<' + this.gruntfile.toString()+ '>');
    //   this.gruntfile.insertConfig('huhn', JSON.stringify({name: "prillan"}));
    // }

    // _testfiles: function () {
    //   var testFramework = this.optionsest-framework'];
    //   if (testFramework != 'none')
    //     this.invoke(testFramework + ':app');
    // }
  }  

});

module.exports = ExpressDevelopGenerator;
