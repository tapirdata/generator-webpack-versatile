import _ = require("lodash")
import http = require("http")
import gutil = require("gulp-util")

import appFactory from "./app"
import setupFactory from "./setup"

class Keeper {

  public options: any
  public server: any

  public create(options: any) {
    const defaultOptions = setupFactory()
    this.options = _.defaultsDeep({}, options, defaultOptions.app)
    const app = appFactory(this.options)
    this.server = http.createServer(app)
  }

  public shout() {
    gutil.log(`Server listening on port ${this.options.port}`)
  }

  public start() {
    this.server.listen(this.options.port)
  }

  public startSafe() {
    return new Promise((resolve, reject) => {
      this.server.on("listening", () => {
        this.shout()
        resolve(this.server)
      })
      this.server.on("error", (err: Error) => {
        reject(err)
      })
      this.start()
    })
  }

  public attach() {
    this.server.on("listening", () => {
      this.shout();
      (process.send as any)({state: "started"})
    })
    this.server.on("close", () => {
      (process.send as any)({state: "stopped"})
    })
    this.server.on("error", (err: Error) => {
      (process.send as any)({state: "failed", error: err})
    })
  }

  public wait() {
    process.on("message", (message) => {
      switch (message.cmd) {
      case "start":
        this.create(message.options)
        this.attach()
        this.start()
        break
      case "stop":
        this.server.close()
        break
      }
    })
  }

}

if (require.main === module) {
  const keeper = new Keeper()
  keeper.wait()
}

function start(options = {}) {
  const keeper = new Keeper()
  keeper.create(options)
  return keeper.startSafe()
}

export default start
