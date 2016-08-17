import util from 'util'; 
import path from 'path'; 
import yosay from 'yosay'; 
import chalk from 'chalk'; 
import _ from 'lodash'; 

import BaseGenerator from '../../lib/base';

let Generator = BaseGenerator.extend({

  constructor() {
    BaseGenerator.apply(this, arguments);
    this.sourceRoot(path.join(__dirname, '../../../templates/app'));
  },

  prompting: {
    askFor() {
      let { config } = this;
      let use = config.get('use');
      if (!this.options['skip-welcome-message']) {
        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the marvelous ExpressDevelop generator!'));
      }
      let prompts = [
        {
          type: 'checkbox',
          name: 'features',
          message: 'What more would you like?',
          choices: [
            {
              name: 'Modernizr',
              value: 'modernizr',
              checked: use.modernizr
            },
            {
              name: 'Foundation',
              value: 'foundation',
              checked: use.foundation
            },
            {
              name: 'Bootstrap',
              value: 'bootstrap',
              checked: use.bootstrap
            },
            {
              name: 'Backbone',
              value: 'backbone',
              checked: use.backbone
            },
            {
              name: 'Marionette',
              value: 'marionette',
              checked: use.marionette
            },
            // {
            //   name: 'Coffee',
            //   value: 'coffee',
            //   checked: use.coffee
            // },
            {
              name: 'Sass',
              value: 'sass',
              checked: use.sass
            },
            {
              name: 'Cache-crusher',
              value: 'crusher',
              checked: use.crusher
            }
          ]
        }
      ];
      // console.log "prompts=#{JSON.stringify(prompts)}"
      return this.prompt(prompts)
        .then(answers => {
          let hasFeature = feat => answers.features.indexOf(feat) !== -1;

          // console.log "answers=#{JSON.stringify(answers)}"
          use.modernizr = hasFeature('modernizr');
          use.foundation = hasFeature('foundation');
          use.bootstrap = hasFeature('bootstrap');
          use.backbone = hasFeature('backbone');
          use.marionette = hasFeature('marionette');
          use.sass = hasFeature('sass');
          use.coffee = true
          use.crusher = hasFeature('crusher');
          return config.set('use', use);
        }
      );
    }
  },

  configuring: { saveConfig() {
    this.config.set(this.settings);
    this.config.save();
  }
},

  writing: {
    projectFiles() {
      console.log('copy project files');
      this._branchCopy('root');
    },
    serverFiles() {
      console.log('copy server files');
      let dirs = this.config.get('dirs');
      this._branchCopy('server', dirs.serverSrc);
    },
    clientfiles() {
      console.log('copy client files');
      let dirs = this.config.get('dirs'); 
      this._branchCopy('client', dirs.clientSrc);
    },
    testfiles() {
      console.log('copy test files');
      let dirs = this.config.get('dirs'); 
      this._branchCopy('test', dirs.test);
    }
  },
  install() {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  }
});
 
export default Generator;
