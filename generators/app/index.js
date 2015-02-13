'use strict';
var util = require('util');
var path = require('path');
var yosay = require('yosay');
var chalk = require('chalk');
var _ = require('lodash');
var BaseGenerator = require('../lib/base');

var ExpressDevelopGenerator = BaseGenerator.extend({

  constructor: function () {
    BaseGenerator.apply(this, arguments);


  },

  prompting: {
    askFor: function () {
      var done = this.async();
      var config = this.config;
      var use = config.get('use');

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
          value: 'backbone',
          checked: use.backbone
        },{
          name: 'Bootstrap',
          value: 'bootstrap',
          checked: use.bootstrap
        },{
          name: 'Modernizr',
          value: 'modernizr',
          checked: use.modernizr
        },{
          name: 'Sass',
          value: 'sass',
          checked: !!use.sass
        },{
          name: 'Coffee',
          value: 'coffee',
          checked: use.coffee
        },
       
        ]
      }, {
          name: 'amdLib',
          message: 'What AMD-Library would you like to use?',
          type: 'list',
          choices: ['curl', 'requireJS'],
          default: (use.amd === 'requirejs') ? 1 : 0
      }];

      this.prompt(prompts, function (answers) {
        function hasFeature(feat) { return answers.features.indexOf(feat) !== -1; }
        console.log('answers=', answers);

        use.bootstrap = hasFeature('bootstrap');
        use.modernizr = hasFeature('modernizr');
        use.backbone  = hasFeature('backbone');
        use.sass      = hasFeature('sass');
        use.coffee    = hasFeature('coffee');
        use.amd       = (answers.amdLib === 'requireJS') ? 'requirejs' : 'curl';
        console.log('use=', use);
        config.set('use', use);
        done();
      }.bind(this));
    }
  },

  configuring: {
    saveConfig: function() {
      this.config.set(this.settings);
      this.config.save();
    }
  },

  writing: {

    projectFiles: function () {
      console.log('copy project files');
      this._branchCopy('root');
    },

    serverFiles: function () {
      console.log('copy server files');
      var dirs = this.config.get('dirs');
      this._branchCopy('server', dirs.serverSrc);
    },

    clientfiles: function () {
      console.log('copy client files');
      var dirs = this.config.get('dirs');
      this._branchCopy('client', dirs.clientSrc);
    },

    testfiles: function () {
      console.log('copy test files');
      var dirs = this.config.get('dirs');
      this._branchCopy('test', dirs.test);
    },

  },

  install: function () {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  },

});

module.exports = ExpressDevelopGenerator;
