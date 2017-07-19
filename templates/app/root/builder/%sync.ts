import gutil = require("gulp-util")
import browserSync = require("browser-sync")

import { Builder } from "."

export class Sync {

  private builder: Builder
  private bs: any

  constructor(builder: Builder) {
    this.builder = builder
    this.bs = browserSync.create()
  }

  public isActive() {
    return this.bs.active
  }

  public async start() {
    if (this.isActive()) {
      return
    }
    const builder = this.builder
    const conf = {
      proxy: `localhost:${builder.getServerPort()}`,
      browser: builder.config.browserSync.browser,
    }
    return new Promise((resolve, reject) => {
      this.bs.init(conf, (err: any) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  public reloadServer() {
    return this.builder.plugins.tap(async () => {
      if (this.builder.isServerActive()) {
        await this.builder.restartServer()
        if (this.isActive()) {
          gutil.log("bs.reload")
          this.bs.reload()
        }
        await this.builder.rerunKarma()
      }
    })
  }

  public reloadClient() {
    if (this.isActive()) {
      return this.bs.stream()
    } else {
      return this.builder.plugins.tap(() => {
        return this.builder.rerunKarma()
      })
    }
  }
}
