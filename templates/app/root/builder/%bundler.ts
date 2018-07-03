import os = require("os")
import path = require("path")
import _ = require("lodash")
import glob = require("glob")
import gulp = require("gulp")
import gutil = require("gulp-util")
import webpack = require("webpack")
import WebpackDevServer = require("webpack-dev-server")
import webpackStream = require("webpack-stream")
import ip = require("ip")

import { Builder } from "."

export class Bundler {

  private serverOptions: any
  private server: any
  private builder: Builder

  constructor(builder: Builder) {
    this.builder = builder
    this.serverOptions = {
      host: ip.address(), // or 'localhost'
      port: 8080,
    }
    this.server = null
  }

  public getServerOptions() {
    return this.serverOptions
  }

  public normalizeEntries(entries: string | string[]) {
    const builder = this.builder
    if (!_.isArray(entries)) {
      entries = [entries]
    }
    let normEntries: string[] = []
    for (let entry of entries) {
      entry = path.resolve(builder.dirs.root, entry)
      normEntries = normEntries.concat(glob.sync(entry))
    }
    return normEntries
  }

  public getConf(opt: any) {
    const builder = this.builder

    function resolveRoot(p: string) {
      return path.resolve(builder.dirs.root, p)
    }
    const scriptDir = resolveRoot(builder.dirs.src.scripts)
    const commonDir = resolveRoot(builder.dirs.src.common)
    const testScriptDir = resolveRoot(builder.dirs.test.scripts)
    const modulesDir = resolveRoot("node_modules")

    const appEntries = this.normalizeEntries(opt.entry)

    const clientModulesBabelOptions = builder.getJsonConfig("babelrc-client-modules.json")

    const conf = {
      mode: "none",
      entry: {
        app: appEntries,
      },
      output: {
        filename: "[name]-bundle.js",
      },
      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
      module: {
        rules: [
          {
            enforce: "pre",
            test: /\.ts$/,
            include: [
              scriptDir,
              commonDir,
              testScriptDir,
            ],
            loaders: ["tslint-loader"],
          },
          {
            test: /\.ts$/,
            include: [
              scriptDir,
              commonDir,
              testScriptDir,
            ],
            loader: "awesome-typescript-loader",
            options: {
              configFileName: builder.getConfigPath("./tsconfig-client.json"),
            },
          },
          {
            test: /\.js$/,
            include: [
              modulesDir,
            ],
            loader: "babel-loader",
            options: clientModulesBabelOptions,
          },
          {
            test: /\.json$/,
            use: [
              {
                loader: "./builder/ejs-substitute-loader",
                options: {
                  params: { builder },
                },
              },
            ],
          },
          {
            test: /\.pug$/,
            loader: "pug-loader",
          },
<% if (use.crusher) { -%>
          {
            test: path.resolve(builder.dirs.root, builder.dirs.src.root),
            loader: path.resolve(__dirname, "crusher-puller-loader"),
            options: {
              crusher: builder.crusher,
            },
          },
<% } -%>
        ],
      },
      optimization: {
        splitChunks: {
          chunks: "initial",
          name: "vendor",
        },
        runtimeChunk: {
          name: "manifest",
        }
      },
      plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoEmitOnErrorsPlugin(),
      ],
      stats: {
        // Nice colored output
        colors: true,
      },
      // Create Sourcemaps for the bundle
      devtool: "source-map",
    }

    if (opt.uglify) {
      conf.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
        }),
      )
    }

    return conf
  }

  public createStream(opt: any) {
    const conf: any = this.getConf(opt)
    conf.watch = opt.watch
    return gulp.src(path.resolve(__dirname, "null.js"))
      .pipe(this.builder.plumber(!opt.watch))  // continue after error if watching
      .pipe(webpackStream(conf, webpack))
<% if (use.crusher) { -%>
      .pipe(this.builder.crusher.pusher({
        tagger: {
          relativeBase: path.join(this.builder.dirs.src.root, "bundles"),
        },
      }))
<% } -%>
  }

  public startDevServer(opt: any) {
    const conf: any = this.getConf(opt)
    //? conf.output.path = "/"
    const serverOptions = this.serverOptions
    // induce reload after recompile:
    conf.entry.app.unshift(`webpack-dev-server/client?http://${serverOptions.host}:${serverOptions.port}/`)
    const compiler = webpack(conf)
    const server = new WebpackDevServer(compiler, {
      publicPath: "/bundles/",
      stats: { colors: true },
    })
    return new Promise((resolve) => {
      server.listen(serverOptions.port, serverOptions.host, () => {
        gutil.log(`WepPack Dev Server listening on ${serverOptions.host}:${serverOptions.port}.`)
        this.server = server
        resolve()
      })
    })
  }
}
