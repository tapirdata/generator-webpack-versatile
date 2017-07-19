import fs = require( "fs")
import path = require("path")
import gutil = require("gulp-util")
import _ = require("lodash")
import yargs = require("yargs")

const envNames = [
  "development",
  "testing",
  "production",
]

const configBase = "./config"

function guessEnv(preName?: string): string {
  let envName
  if (!preName) {
    envName = envNames[0]
  } else {
    for (const name of envNames) {
      if (name.startsWith(preName)) {
        envName = name
        break
      }
    }
    if (!envName) {
      throw(new Error(`invalid mode "${preName}"`))
    }
  }
  return envName
}

function readConf(config: any, envName: string) {
  const confs: any[] = []
  for (const name of [envName, "default"]) {
    const confPath = path.join(configBase, name) + ".json"
    let confText
    try {
      confText = fs.readFileSync(confPath, "utf8")
    } catch (err) {
      gutil.log(`No such config file: "${confPath}".`)
      continue
    }
    const conf = JSON.parse(confText)
    confs.push(conf)
  }
  _.defaultsDeep(config, ...confs)
}

function configFactory() {
  const argv = yargs.argv
  const envName = guessEnv(process.env.NODE_ENV || argv.env)
  const mode = {
    ["is" + _.capitalize(envName)]: true,
  }
  const config: any = {
    mode,
  }
  readConf(config, envName)
  return config
}

export default configFactory
