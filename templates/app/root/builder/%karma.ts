import path = require("path")
import gutil = require("gulp-util")
import karma = require("karma")

import { Builder } from "."

export class Karma {

  private builder: Builder
  private server: karma.Server | null = null
  private reporters: any
  private browsers: any
  private karmaConf: any

  constructor(builder: Builder) {
    this.builder = builder
    this.browsers = builder.config.karma.browsers
    this.reporters = {
      work: [
        "mocha",
      ],
      ci: [
        "mocha",
        "junit",
      ],
    }
  }

  public isActive() {
    return !!this.server
  }

  public async start(options: any) {
    const builder = this.builder
    const karmaConf = {
      urlRoot: "/__karma__/",
      files: [
        {
          pattern: `${builder.dirs.tgt.client}/bundles/manifest-bundle?(-+([a-f0-9])).js`,
          watched: false,
        },
        {
          pattern: `${builder.dirs.tgt.client}/bundles/vendor-bundle?(-+([a-f0-9])).js`,
          watched: false,
        },
        {
          pattern: `${builder.dirs.tgt.client}/bundles/app-bundle?(-+([a-f0-9])).js`,
          watched: false,
        },
      ],
      frameworks: [
        "mocha",
      ],
      browsers: builder.headlessEnabled ? this.browsers.ci : this.browsers.work,
      reporters: builder.headlessEnabled ? this.reporters.ci : this.reporters.work,
      junitReporter: {
        outputDir: path.join(builder.dirs.tmp, "test-results"),
        outputFile: "client.xml",
      },
      proxies: {
        "/": `http://localhost:${builder.getServerPort()}/`,
      },
      client: {
        captureConsole: true,
        mocha: {
          bail: true,
        },
      },
      singleRun: options.singleRun,
      browserNoActivityTimeout: 10000,
    }

    this.karmaConf = karmaConf

    return new Promise((resolve) => {
      this.server = new karma.Server(karmaConf, (exitCode) => {
        // gutil.log('karma start done. code=%s', exitCode);
        this.server = null
        resolve(exitCode)
      })
      this.server.start()
    })

  }

  public async rerun() {
    // gutil.log('karma rerun');
    if (!this.isActive()) {
      return null
    }
    const karmaConf = this.karmaConf
    return new Promise((resolve) => {
      karma.runner.run(karmaConf, (exitCode) => {
        gutil.log("karma rerun done." + (exitCode === 0 ? "" : ` exitCode=${exitCode}`))
        resolve(exitCode)
      })
    })
  }

}
