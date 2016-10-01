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
    return this.prompt(questions)
      .then(answers => {
        let hasFeature = feat => answers.features.indexOf(feat) !== -1;

        use.modernizr = hasFeature('modernizr');
        use.foundation = hasFeature('foundation');
        use.bootstrap = hasFeature('bootstrap');
        use.backbone = hasFeature('backbone');
        use.marionette = hasFeature('marionette');
        use.sass = hasFeature('sass');
        use.crusher = hasFeature('crusher');
        return config.set('use', use);
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
