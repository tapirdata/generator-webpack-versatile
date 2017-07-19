import path = require("path")
import _ = require("lodash")
import slug = require("slug")
import Generator = require("yeoman-generator")

const slash = require("slash")

import { Answers } from "../../lib/base"

export default class Makeup {

  public generator: Generator
  public config: any

  constructor(generator: Generator) {
    this.generator = generator
    this.config = {}
  }

  hasFeature(feature: string) {
    return _.isArray(this.config.features) && this.config.features.indexOf(feature) >= 0
  }

  setAppname(appname: string) {
    if (_.isString(appname)) {
      this.config.appname = appname
    }
  }

  setDirs(dirs: any) {
    if (_.isObject(dirs)) {
      this.config.dirs = dirs
    } else {
      this.config.dirs = {}
    }
  }

  setUrls(urls: any) {
    if (_.isObject(urls)) {
      this.config.urls = urls
    } else {
      this.config.urls = {}
    }
  }

  setFramework(framework: string) {
    if (this.allFrameworks.indexOf(framework) >= 0) {
      this.config.framework = framework
    }
  }

  setFrontend(frontend: string) {
    if (this.allFrontends.indexOf(frontend) >= 0) {
      this.config.frontend = frontend
    }
  }

  setFeatures(features?: string[]) {
    if (_.isArray(features)) {
      this.config.features = _(this.allFeatures)
        .filter((feature) => features.indexOf(feature) >= 0)
        .value()
    }
  }

  addFeatures(features: string | string[]) {
    if (!_.isArray(this.config.features))
      this.config.features = []
    if (! _.isArray(features))
      features = [features]
    this.config.features = _(this.allFeatures)
      .filter((feature) => this.config.features.indexOf(feature) >= 0 || features.indexOf(feature) >= 0)
      .value()
  }

  removeFeatures(features: string | string[]) {
    if (!_.isArray(this.config.features))
      this.config.features = []
    if (! _.isArray(features))
      features = [features]
    this.config.features = _(this.allFeatures)
      .filter((feature) => this.config.features.indexOf(feature) >= 0 && features.indexOf(feature) < 0)
      .value()
  }

  applyConfig(config: any) {
    // console.log('applyConfig config=', config);
    this.setAppname(config.appname)
    this.setDirs(config.dirs)
    this.setUrls(config.urls)
    this.setFramework(config.framework)
    this.setFrontend(config.frontend)
    this.setFeatures(config.features)
  }

  applyOptions(options: any) {
    // console.log('applyOptions options=', options);
    this.setAppname(options.appname)
    _.merge(this.config.dirs, {
      bower     : options.bowerDir,
      src       : options.srcDir,
      test      : options.testDir,
      tmp       : options.tmpDir,
      tmpDev    : options.tmpDevDir,
      tmpTest   : options.tmpTestDir,
      dist      : options.distDir,
    })
    _.merge(this.config.urls, {
      staticBase: options.staticBaseUrl,
    })
  }

  applyDefaults(appname: string) {
    const { config } = this
    const { dirs, urls } = _.defaults(config, {
      appname,
      dirs: {},
      urls: {},
    })

    _.defaults(dirs, {
      bower: "bower_components",
      src: "src",
      test: "test",
      tmp: ".tmp",
      dist: "dist",
    })
    _.defaults(dirs, {
      tmpDev: slash(path.join(dirs.tmp, "dev")),
      tmpTest: slash(path.join(dirs.tmp, "test")),
    })

    _.defaults(urls, {
      staticBase: "/__static__",
    })

    _.defaults(config, {
      framework: "marionette",
      frontend: "foundation",
    })

    if (!config.features)
      this.setFeatures(["modernizr", "sass", "crusher"])
  }

  getQuestions() {
    const { config } = this
    return [
      {
        type: "list",
        name: "framework",
        message: "What model-view-* framework would you like to use?",
        choices: [
          {
            name: "None",
            value: "none",
          },
          {
            name: "Backbone",
            value: "backbone",
          },
          {
            name: "Backbone + Marionette",
            value: "marionette",
          },
        ],
        default: config.framework,
      },
      {
        type: "list",
        name: "frontend",
        message: "What Front-end framework would you like to use?",
        choices: [
          {
            name: "None",
            value: "none",
          },
          {
            name: "Foundation",
            value: "foundation",
          },
          {
            name: "Bootstrap",
            value: "bootstrap",
          },
        ],
        default: config.frontend,
      },
      {
        type: "checkbox",
        name: "features",
        message: "What extra features would you like?",
        choices: (answers: any) => {
          const choices = [
            {
              name: "Server side rendering",
              value: "serverRender",
              checked: this.hasFeature("serverRender"),
              disabled: answers.framework === "none"
                ? "required if no framework selected"
                : undefined,
            },
            {
              name: "Modernizr",
              value: "modernizr",
              checked: this.hasFeature("modernizr"),
              disabled: answers.frontend === "foundation"
                ? "required by foundation"
                : undefined,
            },
            {
              name: "Sass",
              value: "sass",
              checked: this.hasFeature("sass"),
              disabled: answers.frontend === "foundation"
                ? "required by foundation"
                : answers.frontend === "bootstrap"
                  ? "required by bootstrap"
                  : undefined,
            },
            {
              name: "Cache-crusher",
              value: "crusher",
              checked: this.hasFeature("crusher"),
            },
          ]
          return choices
        },
      },
    ]
  }

  autoAdjust() {
    const { config } = this
    if (config.framework === "none")
      this.addFeatures(["serverRender"])
    if (config.frontend === "foundation")
      this.addFeatures(["modernizr", "sass"])
    if (config.frontend === "bootstrap")
      this.addFeatures(["sass"])
  }

  putAnswers(answers: any) {
    this.setFramework(answers.framework)
    this.setFrontend(answers.frontend)
    this.setFeatures(answers.features)
    if (!answers.noAdjust)
      this.autoAdjust()
  }

  getTemplateConfig() {
    const { config } = this
    return {
      appname     : config.appname,
      appnameSlug : slug(config.appname),
      appnameCap  : _.capitalize(config.appname),
      dirs        : config.dirs,
      urls        : config.urls,
      use: {
        backbone   : config.framework === "backbone" || config.framework === "marionette",
        marionette : config.framework === "marionette",
        foundation : config.frontend === "foundation",
        bootstrap  : config.frontend === "bootstrap",
        serverRender : this.hasFeature("serverRender"),
        modernizr    : this.hasFeature("modernizr"),
        sass         : this.hasFeature("sass"),
        crusher      : this.hasFeature("crusher"),
      },
    }
  }

  getPermanetConfig() {
    return this.config
  }

  get allFrameworks() {
    return ["none", "backbone", "marionette"]
  }

  get allFrontends() {
    return ["none", "foundation", "bootstrap"]
  }

  get allFeatures() {
    return ["serverRender", "modernizr", "sass", "crusher"]
  }

}
