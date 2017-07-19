import path = require("path")
import express = require("express")
import compression = require("compression")
import favicon = require("serve-favicon")
// tslint:disable-next-line:no-var-requires
const robots = require("robots.txt")

import routesFactory from "./routes/main"

export default function(options: any) {
  const app = express()
  app.set("views", path.join(__dirname, "..", "templates"))
  app.set("view engine", "pug")
  app.locals.pretty = true
  app.use(compression())
  app.use(favicon(path.join(options.clientDir, "images", "favicon.ico")))
  app.use(robots(path.join(options.clientDir, "pages", "robots.txt")))
  app.use("<%= urls.staticBase %>", express.static(options.clientDir))
  app.use("/", routesFactory(options))
  return app
}
