import path = require("path")
import childProcess = require("child_process")
import gutil = require("gulp-util")

import { Builder } from "."

export class Server {

  public port: number
  private builder: Builder
  private server: any
  private callBacks: {[name: string]: any}
  private srvChild: any

  constructor(builder: Builder) {
    this.builder = builder
    this.port = builder.config.server.port || 8000
    this.server = null
    this.callBacks = {}
    this.srvChild = null
  }

  public isActive() {
    return !!this.srvChild
  }

  public registerCallBack(name: string, cb: any) {
    let nameCallBacks = this.callBacks[name]
    if (!nameCallBacks) {
      this.callBacks[name] = nameCallBacks = []
      nameCallBacks.push(cb)
    }
  }

  public fireCallBacks(name: string, message: string) {
    const nameCallBacks = this.callBacks[name]
    this.callBacks = {}
    if (nameCallBacks) {
      for (const cb of nameCallBacks) {
        cb.call(this, message)
      }
    }
  }

  public async start() {
    gutil.log("starting server...")
    if (this.isActive()) {
      gutil.log("server already running!")
      return
    }
    return new Promise((resolve, reject) => {
      const startPath = path.resolve(__dirname, `../${this.builder.dirs.tgt.server}/scripts/start`)
      const srvChild = childProcess.fork(startPath)
      srvChild.on("message", (message) => {
        // console.log('server sent:', message);
        if (message) {
          this.fireCallBacks(message.state, message)
        }
      })
      this.registerCallBack("started", () => {
        gutil.log("server started.")
        this.srvChild = srvChild
        resolve()
      })
      this.registerCallBack("failed", (message: any) => {
        gutil.log("server failed:", message.error)
        srvChild.kill()
        reject()
      })
      srvChild.send({
        cmd: "start",
        options: {
          port: this.port,
        },
      })
    })
  }

  public async stop() {
    gutil.log("stopping server...")
    if (!this.isActive()) {
      gutil.log("no server running!")
      return
    }
    return new Promise((resolve, reject) => {
      this.registerCallBack("stopped", (message: any) => {
        const error = message.error
        gutil.log("server stopped.%s", error == null ? "" : ` error=${error}`)
        this.srvChild = null
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
      this.srvChild.send({cmd: "stop"})
    })
  }

  public async restart() {
    await this.stop()
    await this.start()
  }
}
