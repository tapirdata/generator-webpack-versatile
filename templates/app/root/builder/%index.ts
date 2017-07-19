import path = require( "path")
import fs = require("fs")
import gutil = require("gulp-util")
import lazypipe = require("lazypipe")
import pluginsFactory = require("gulp-load-plugins")

import configFactory from "./config"
<% if (use.crusher) { -%>
import crusherFactory from "./crusher"
<% } -%>
import dirsFactory from "./dirs"
import globPatterns from "./glob-patterns"
<% if (use.modernizr) { -%>
import modernizrFactory from "./modernizr"
<% } -%>

import { Bundler } from "./bundler"
import { Mocha } from "./mocha"
import { Server } from "./server"
import { Sync } from "./sync"

import { Karma } from "./karma" // ts-node needs karma after sync

const rootDir = path.join(__dirname, "..")

export class Builder {

  public watchEnabled = false
  public headlessEnabled = false

  public plugins: {[name: string]: any} = pluginsFactory()
  public config = configFactory()
  public dirs = dirsFactory(rootDir, this.config)
  public globPatterns = globPatterns
<% if (use.modernizr) { -%>
  public modernizr: any
<% } -%>
  public crusher: any
  public bundler: Bundler
  public server: Server
  public sync: Sync
  public mocha: Mocha
  public karma: Karma

  constructor() {
<% if (use.modernizr) { -%>
    this.modernizr = modernizrFactory(this)
<% } -%>
<% if (use.crusher) { -%>
    this.crusher = crusherFactory(this)
<% } -%>
    this.bundler = new Bundler(this)
    this.server = new Server(this)
    this.sync = new Sync(this)
    this.mocha = new Mocha(this)
    this.karma = new Karma(this)
  }

  public getConfigPath(fname: string) {
    return path.join(this.dirs.root, "config", fname)
  }

  public getJsonConfig(fname: string) {
    const configPath = this.getConfigPath(fname)
    return JSON.parse(fs.readFileSync(configPath, "utf-8"))
  }

  public joinRelative(fromParts: string[], toParts: string[]) {
    return path.relative(
        path.join(...toParts),
        path.join(...fromParts),
        )
  }

  public getBundleUrl() {
    if (this.watchEnabled) {
      const serverOptions = this.bundler.getServerOptions()
      return `http://${serverOptions.host}:${serverOptions.port}/bundles`
    } else {
      return "<%= urls.staticBase %>/bundles"
    }
  }

  public plumber(hard: boolean = true) {
    return this.plugins.plumber({
      errorHandler(err: any) {
        gutil.log(
          gutil.colors.red("Error:\n"),
          err.toString(),
        )
        if (hard) {
          return this.emit("end")
        }
      },
    })
  }

  public makeScriptPipe(tsOptions: any) {
    const tsFilter = this.plugins.filter([this.globPatterns.TS], {restore: true})
    const lp = lazypipe()
      .pipe(() => tsFilter)
      .pipe(this.plugins.typescript, tsOptions)
      .pipe(() => tsFilter.restore)
    return lp()
  }

  public async rerunKarma() {
    return this.karma.rerun()
  }

  public async restartServer() {
    return this.server.restart()
  }

  public getServerPort(): number {
    return this.server.port
  }

  public isServerActive(): boolean {
    return this.server.isActive()
  }

}
