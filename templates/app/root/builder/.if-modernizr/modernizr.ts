import fs = require("fs")
import path = require("path")
import _ = require( "lodash")
import { Readable } from "stream"
import VinylFile = require("vinyl")
// tslint:disable-next-line:no-var-requires
const Modernizr = require("modernizr")

import { Builder } from "."

export default function(builder: Builder) {

  return (options: any = {}) => {
    let { configPath } = options
    if (configPath === "ALL") {
      const modernizrDir = path.dirname(require.resolve("modernizr"))
      configPath = path.join(modernizrDir, "config-all.json")
    }
    const outStream = new Readable({ objectMode: true })
    let buildStarted = false
    outStream._read = () => {
      if (buildStarted) {
        return outStream.push(null)
      } else {
        let config
        if (configPath) {
          try {
            config = JSON.parse(fs.readFileSync(configPath, "utf8"))
          } catch (error) {
            throw new Error(`Cannot find Modernizer config file '${configPath}': ${error}`)
          }
        } else {
          config = {}
        }
        if (options.config) {
          _.merge(config, options.config)
        }
        buildStarted = true
        return Modernizr.build(config, (output: string) => {
          const outFile = new VinylFile({
            path: "modernizr.js",
            contents: Buffer.from(output),
          })
          return outStream.push(outFile)
        })
      }
    }
    return outStream
  }

}
