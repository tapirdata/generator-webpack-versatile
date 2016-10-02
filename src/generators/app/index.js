import path from 'path';
import _ from 'lodash';
import yosay from 'yosay';
import slug from 'slug';

import BaseGenerator from '../../lib/base';


class AppGenerator extends BaseGenerator {

  constructor(...args) {
    super(...args);
    this.sourceRoot(path.join(__dirname, '../../../templates/app'));
    this._initConfig();
    this._optionConfig();
    this._defaultConfig();
  }

  _initConfig() {
    let { config } = this;
    config.defaults({
      appname: this.appname,
      appnameSlug: slug(this.appname),
      appnameCap: _.capitalize(this.appname),
      dirs: {},
      use: {},
    });
  }

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
  }

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
    }));
    dirs = config.get('dirs');
    config.set('dirs', _.defaults(dirs, {
      serverSrc: path.join(dirs.src, 'server'),
      clientSrc: path.join(dirs.src, 'client'),
      tmpDev: path.join(dirs.tmp, 'dev'),
      tmpTest: path.join(dirs.tmp, 'test')
    }));
    use = config.get('use');
    config.set('use', _.defaults(use, {
      backbone: true,
      marionette: true,
      foundation: true,
      bootstrap: false,
      modernizr: true,
      sass: true,
      crusher: true
    }));
  }

  prompting () {
    let { config } = this;
    let use = config.get('use');
    if (!this.options['skip-welcome-message']) {
      // Have Yeoman greet the user.
      this.log(yosay('Welcome to the marvelous ExpressDevelop generator!'));
    }
    let questions = [
      {
        type: 'list',
        name: 'frontend',
        message: 'What Front-end framework would you like to use?',
        choices: [
          {
            name: 'None',
            value: 'none',
          },
          {
            name: 'Foundation',
            value: 'foundation',
          },
          {
            name: 'Bootstrap',
            value: 'bootstrap',
          },
        ],
        default: use.foundation ? 'foundation' : use.bootstrap ? 'bootstrap' : 'none',
      },
      {
        type: 'list',
        name: 'mvend',
        message: 'What Model-View-* framework would you like to use?',
        choices: [
          {
            name: 'None',
            value: 'none',
          },
          {
            name: 'Backbone',
            value: 'backbone',
          },
          {
            name: 'Backbone + Marionette',
            value: 'marionette',
          },
        ],
        default: use.marionette ? 'marionette' : use.backbone ? 'backbone' : 'none',
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'What extra features would you like?',
        choices: answers => {
          const choices = [
            {
              name: 'Modernizr',
              value: 'modernizr',
              checked: use.modernizr,
              disabled: answers.frontend === 'foundation' ? 'required by foundation' : false,
            },
            {
              name: 'Sass',
              value: 'sass',
              checked: use.sass,
            },
            {
              name: 'Cache-crusher',
              value: 'crusher',
              checked: use.crusher,
            }
          ];
          return choices;
        }
      }
    ];
    return this.prompt(questions)
      .then(answers => {
        const features = answers.features;
        const frontend = answers.frontend;
        const mvend = answers.mvend;
        function hasFeature(feat) {
          return features.indexOf(feat) !== -1;
        };
        use.foundation = frontend === 'foundation';
        use.bootstrap = frontend === 'bootstrap';

        use.marionette = mvend === 'marionette';
        use.backbone = use.marionette || mvend === 'backbone';

        use.modernizr = use.foundation || hasFeature('modernizr');
        use.sass = hasFeature('sass');
        use.crusher = hasFeature('crusher');

        config.set('use', use);
      }
    );
  }

  configuring() {
    this.config.set(this.settings);
    this.config.save();
  }

  writing() {
    const use = this.config.get('use');
    const dirs = this.config.get('dirs');

    // this.log('copy project files');
    this._branchCopy({
      source: 'root',
      branches: use,
    });

    // this.log('copy server files');
    this._branchCopy({
      source: 'server',
      target: dirs.serverSrc,
      branches: use,
    });

    // this.log('copy client files');
    this._branchCopy({
      source: 'client',
      target: dirs.clientSrc,
      branches: use,
    });

    // this.log('copy test files');
    this._branchCopy({
      source: 'test',
      target: dirs.test,
      branches: use,
    });
  }

  install() {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  }
};

export default AppGenerator;
