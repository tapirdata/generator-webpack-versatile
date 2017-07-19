import os = require("os")
import path = require("path")
import _ = require("lodash")
import glob = require("glob")
import gulp = require("gulp")
import gutil = require("gulp-util")
import webpack = require("webpack")
import WebpackDevServer = require("webpack-dev-server")
import webpackStream = require("webpack-stream")

import { Builder } from "."

export class Bundler {

  private serverOptions: any
  private server: any
  private builder: Builder

  constructor(builder: Builder) {
    this.builder = builder
    this.serverOptions = {
      host: os.hostname(),  // or: 'localhost',
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
    const configDir = resolveRoot(builder.dirs.src.config)
    const testScriptDir = resolveRoot(builder.dirs.test.scripts)
    const modulesDir = resolveRoot("node_modules")

    const appEntries = this.normalizeEntries(opt.entry)

    const clientModulesBabelOptions = builder.getJsonConfig("babelrc-client-modules.json")

    const conf = {
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
              configDir,
              testScriptDir,
            ],
            loaders: ["tslint-loader"],
          },
          {
            test: /\.ts$/,
            include: [
              scriptDir,
              configDir,
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
                loader: "json-loader",
              },
              {
                loader: "./builder/ejs-substitute-loader",
                options: {
                  params: {
                    builder,
                  },
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
      plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
          name: "vendor",
          minChunks(module) {
            return module.context && module.context.indexOf("node_modules") !== -1
          },
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: "manifest",
        }),
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

  public async startDevServer(opt: any) {
    const conf: any = this.getConf(opt)
    conf.output.path = "/"
    const serverOptions = this.serverOptions
    conf.entry.app.unshift(`webpack-dev-server/client?http://${serverOptions.host}:${serverOptions.port}/`)
    const compiler = webpack(conf)
    const server = new WebpackDevServer(compiler, {
      publicPath: "/bundles/",
      public: serverOptions.host,
      stats: { colors: true },
    })
    return new Promise((resolve) => {
      server.listen(serverOptions.port, () => {
        gutil.log(`WepPack Dev Server listening on port ${serverOptions.port}.`)
        this.server = server
        resolve()
      })
    })
  }
}
