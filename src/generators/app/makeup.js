import path from 'path';
import _ from 'lodash';
import slug from 'slug';

class Makeup {

  constructor(generator) {
    this.generator = generator;
    this.config = {};
  }

  hasFeature(feature) {
    return _.isArray(this.config.features) && this.config.features.indexOf(feature) >= 0;
  }

  setAppname(appname) {
    if (_.isString(appname)) {
      this.config.appname = appname;
    }
  }

  setDirs(dirs) {
    if (_.isObject(dirs)) {
      this.config.dirs = dirs;
    } else {
      this.config.dirs = {};
    }
  }

  setUrls(urls) {
    if (_.isObject(urls)) {
      this.config.urls = urls;
    } else {
      this.config.urls = {};
    }
  }

  setFramework(framework) {
    if (Makeup.allFrameworks.indexOf(framework) >= 0) {
      this.config.framework = framework;
    }
  }

  setFrontend(frontend) {
    if (Makeup.allFrontends.indexOf(frontend) >= 0) {
      this.config.frontend = frontend;
    }
  }

  setFeatures(features) {
    if (_.isArray(features)) {
      this.config.features = _(Makeup.allFeatures)
        .filter(feature => features.indexOf(feature) >= 0)
        .value();
    }
  }

  addFeatures(features) {
    if (!_.isArray(this.config.features))
      this.config.features = [];
    if (! _.isArray(features))
      features = [features];
    this.config.features = _(Makeup.allFeatures)
      .filter(feature => this.config.features.indexOf(feature) >= 0 || features.indexOf(feature) >= 0)
      .value();
  }

  removeFeatures(features) {
    if (!_.isArray(this.config.features))
      this.config.features = [];
    if (! _.isArray(features))
      features = [features];
    this.config.features = _(Makeup.allFeatures)
      .filter(feature => this.config.features.indexOf(feature) >= 0 && !features.indexOf(feature) >= 0)
      .value();
  }

  applyConfig(config) {
    // console.log('applyConfig config=', config);
    this.setAppname(config.appname);
    this.setDirs(config.dirs);
    this.setUrls(config.urls);
    this.setFramework(config.framework);
    this.setFrontend(config.frontend);
    this.setFeatures(config.features);
  }

  applyOptions(options) {
    // console.log('applyOptions options=', options);
    this.setAppname(options.appname);
    _.merge(this.config.dirs, {
      bower     : options.bowerDir,
      src       : options.srcDir,
      serverSrc : options.serverSrcDir,
      clientSrc : options.clientSrcDir,
      test      : options.testDir,
      tmp       : options.tmpDir,
      tmpDev    : options.tmpDevDir,
      tmpTest   : options.tmpTestDir,
      dist      : options.distDir,
    });
    _.merge(this.config.urls, {
      staticBase: options.staticBaseUrl
    });
  }

  applyDefaults(appname) {
    let { config } = this;
    let { dirs, urls } = _.defaults(config, {
      appname: appname,
      dirs: {},
      urls: {},
    });

    _.defaults(dirs, {
      bower: 'bower_components',
      src: 'src',
      test: 'test',
      tmp: '.tmp',
      dist: 'dist'
    });
    _.defaults(dirs, {
      serverSrc: path.join(dirs.src, 'server'),
      clientSrc: path.join(dirs.src, 'client'),
      tmpDev: path.join(dirs.tmp, 'dev'),
      tmpTest: path.join(dirs.tmp, 'test')
    });

    _.defaults(urls, {
      staticBase: '/__static__'
    });

    _.defaults(config, {
      framework: 'marionette',
      frontend: 'foundation',
    });

    if (!config.features)
      this.setFeatures(['modernizr', 'sass', 'crusher']);
  }


  getQuestions() {
    const { config } = this;
    return [
      {
        type: 'list',
        name: 'framework',
        message: 'What model-view-* framework would you like to use?',
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
        default: config.framework,
      },
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
        default: config.frontend,
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
              checked: this.hasFeature('modernizr'),
              disabled: answers.frontend === 'foundation'
                ? 'required by foundation'
                : false,
            },
            {
              name: 'Sass',
              value: 'sass',
              checked: this.hasFeature('sass'),
              disabled: answers.frontend === 'foundation'
                ? 'required by foundation'
                : answers.frontend === 'bootstrap'
                ? 'required by bootstrap'
                : false,
            },
            {
              name: 'Cache-crusher',
              value: 'crusher',
              checked: this.hasFeature('crusher'),
            }
          ];
          return choices;
        }
      }
    ];
  }

  autoAdjust() {
    const { config } = this;
    if (config.frontend === 'foundation')
      this.addFeatures(['modernizr', 'sass']);
    if (config.frontend === 'bootstrap')
      this.addFeatures(['sass']);
  }

  putAnswers(answers) {
    this.setFramework(answers.framework);
    this.setFrontend(answers.frontend);
    this.setFeatures(answers.features);
    if (!answers.noAdjust)
      this.autoAdjust();
  }

  getTemplateConfig() {
    const { config } = this;
    return {
      appname     : config.appname,
      appnameSlug : slug(config.appname),
      appnameCap  : _.capitalize(config.appname),
      dirs        : config.dirs,
      urls        : config.urls,
      use: {
        backbone   : config.framework === 'backbone' || config.framework === 'marionette',
        marionette : config.framework === 'marionette',
        foundation : config.frontend === 'foundation',
        bootstrap  : config.frontend === 'bootstrap',
        modernizr  : this.hasFeature('modernizr'),
        sass       : this.hasFeature('sass'),
        crusher    : this.hasFeature('crusher'),
      }
    };
  }

  getPermanetConfig() {
    return this.config;
  }

}

Makeup.allFrameworks = ['none', 'backbone', 'marionette'];
Makeup.allFrontends = ['none', 'foundation', 'bootstrap'];
Makeup.allFeatures = ['modernizr', 'sass', 'crusher'];


export default Makeup;

