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
      'app-dir':        'app',
      'static-dir':     'static'
    });

    this.appDir    = this.options['app-dir'];
    this.staticDir = this.options['static-dir'];
  },

  init: function () {
    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

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
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: true
      },{
        name: 'Sass',
        value: 'includeSass',
        checked: true
      },{
        name: 'Modernizr',
        value: 'includeModernizr',
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

      this.includeLibSass = answers.libsass;
      this.includeRubySass = !(answers.libsass);

      done();
    }.bind(this));
  },

  _mkdirs: function (base, names) {
    for (var i=0; i<names.length; ++i) {
      var name = names[i];
      this.mkdir(path.join(base, name));
    }
  },

  app: function () {
    var appDir = this.appDir;
    this.mkdir(appDir);
    this._mkdirs(appDir, ['views', 'routes', 'styles', 'images']);
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');

    // this.copy('test', 'test');
  },

  staticfiles: function () {
    var staticDir = this.staticDir;
    this._mkdirs(staticDir, ['styles', 'scripts']);
    var statics = ['favicon.ico', '404.html', 'robots.txt'];
    for (var i=0; i<statics.length; ++i) {
      var name = statics[i];
      this.copy(path.join('static', name), path.join(staticDir, name));
    }
  },

  appfiles: function () {
    var appDir = this.appDir;
    this.copy(path.join('app', 'app-factory.js'), path.join(appDir, 'app-factory.js'));
    this.copy(path.join('app', 'startapp.js'), path.join(appDir, 'startapp.js'));
    this.copy(path.join('views', 'index.jade'), path.join(appDir, 'views', 'index.jade'));
    this.copy(path.join('views', 'layout.jade'), path.join(appDir, 'views', 'layout.jade'));
    this.copy(path.join('styles', 'main.scss'), path.join(appDir, 'styles', 'main.scss'));
    this.copy(path.join('routes', 'index.js'), path.join(appDir, 'routes', 'index.js'));
    this.copy(path.join('routes', 'otto.js'), path.join(appDir, 'routes', 'otto.js'));
  },

  gruntfile: function () {
    this.copy('Gruntfile-simple.js', 'Gruntfile.js');
  }

  // _testfiles: function () {
  //   var testFramework = this.options['test-framework'];
  //   if (testFramework != 'none')
  //     this.invoke(testFramework + ':app');
  // }

});

module.exports = ExpressDevelopGenerator;
