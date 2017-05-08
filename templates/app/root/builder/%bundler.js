import os from 'os';
import path from 'path';
import _ from 'lodash';
import glob from 'glob';
import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackStream from 'webpack-stream';


class Bundler {

  constructor(builder) {
    this.builder = builder;
    this.serverOptions = {
      host: os.hostname(),  // or: 'localhost',
      port: 8080,
    }
    this.server = null;
  }

  normalizeEntries(entries) {
    let builder = this.builder;
    if (!_.isArray(entries)) {
      entries = [entries];
    }
    let normEntries = [];
    for (let entry of entries) {
      entry = path.resolve(builder.dirs.root, entry);
      normEntries = normEntries.concat(glob.sync(entry));
    }
    return normEntries;
  }

  getConf(opt) {
    let builder = this.builder;
    let scriptDir = path.resolve(builder.dirs.root, builder.dirs.src.scripts);
    let configDir = path.resolve(builder.dirs.root, builder.dirs.src.config);
    let testScriptDir = path.resolve(builder.dirs.root, builder.dirs.test.scripts);

    let appEntries = this.normalizeEntries(opt.entry);

    let presets = [
      ['es2015', { modules: false }],
      'stage-3',
    ]

    let conf = {
      entry: {
        app: appEntries,
      },
      output: {
        filename: '[name]-bundle.js',
      },
      module: {
        rules: [
          {
            enforce: 'pre',
            test: /\.js$/,
            loaders: ['eslint-loader'],
          },
          {
            test: new RegExp(`^${scriptDir}\/.*\.js$`),
            loader: 'babel-loader',
            options: {
              presets: presets,
            }
          },
          {
            test: new RegExp(`^${configDir}\/.*\.js$`),
            loader: 'babel-loader',
            options: {
              presets: presets,
            }
          },
          {
           test: new RegExp(`^${testScriptDir}\/.*\.js$`),
            loader: 'babel-loader',
            options: {
              presets: presets,
            }
          },
          {
            test: /\.json$/,
            use: [
              {
                loader: 'json-loader',
              },
              {
                loader: './builder/ejs-substitute-loader',
                options: {
                  params: {
                    builder
                  }
                }
              },
            ]
          },
          {
            test: /\.pug$/,
            loader: 'pug-loader',
          },
<% if (use.crusher) { -%>
          {
            test: path.resolve(builder.dirs.root, builder.dirs.src.root),
            loader: path.resolve(__dirname, 'crusher-puller-loader'),
            options: {
              crusher: builder.crusher
            }
          },
<% } -%>
        ]
      },
      plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: function(module) {
            return module.context && module.context.indexOf('node_modules') !== -1;
          }
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest',
        }),
      ],
      stats: {
        // Nice colored output
        colors: true
      },
      // Create Sourcemaps for the bundle
      devtool: 'source-map',
    };

    if (opt.uglify) {
      conf.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
        })
      );
    }

    return conf;
  }

  createStream(opt, cb) {
    let conf = this.getConf(opt);
    conf.watch = opt.watch;
    return gulp.src(path.resolve(__dirname, 'null.js'))
      .pipe(webpackStream(conf, webpack, cb))<% if (use.crusher) { %>
      .pipe(this.builder.crusher.pusher({
        tagger: {
          relativeBase: path.join(this.builder.dirs.src.root, 'bundles')
        }
      }))<% } %>;
  }

  startDevServer(opt) {
    let conf = this.getConf(opt);
    conf.output.path = '/';
    const serverOptions = this.serverOptions;
    conf.entry.app.unshift(`webpack-dev-server/client?http://${serverOptions.host}:${serverOptions.port}/`);
    let compiler = webpack(conf);
    let server = new WebpackDevServer(compiler, {
      publicPath: '/bundles/',
      public: serverOptions.host,
      stats: { colors: true },
    });
    return new Promise(resolve => {
      server.listen(serverOptions.port, function() {
        gutil.log(`WepPack Dev Server listening on port ${serverOptions.port}.`);
        this.server = server;
        resolve();
      });
    });
  }
}

export default function(builder) {
  return new Bundler(builder);
}




