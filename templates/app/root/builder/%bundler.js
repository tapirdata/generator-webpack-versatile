import os from 'os';
import path from 'path';
import _ from 'lodash';
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

  getConf(opt) {
    let builder = this.builder;
    let testScriptDir = path.resolve(builder.dirs.root, builder.dirs.test.client, 'scripts');
    let scriptDir = path.resolve(builder.dirs.root, builder.dirs.src.client, 'scripts');

    let appEntries = opt.entry;
    if (!_.isArray(appEntries)) {
      appEntries = [appEntries];
    }
    appEntries = _.map(appEntries, entry => path.resolve(builder.dirs.root, entry));

    let conf = {
      entry: {
        app: appEntries,
        vendor: [
          'jquery',
          'lodash',
<% if (use.backbone) { -%>
          'backbone',
<% if (use.marionette) { -%>
          'backbone.marionette',
<% }} -%>
        ],
      },
      output: {
        filename: '[name]-bundle.js',
      },
<% if (use.crusher) { -%>
      crusher: builder.crusher,
<% } -%>
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            loaders: ['eslint-loader'],
          },
        ],
        loaders: [
          {
           test: new RegExp(`^${scriptDir}\/.*\.js$`),
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'stage-3'],
              plugins: ['transform-runtime'],
            }
          },
          {
           test: new RegExp(`^${testScriptDir}\/.*\.js$`),
            loader: 'babel-loader',
            query: {
              presets: ['es2015', 'stage-3'],
              plugins: ['transform-runtime'],
            }
          },
          {
            test: /\.pug$/,
            loader: 'pug-loader',
          },
<% if (use.crusher) { -%>
          {
            test: path.resolve(builder.dirs.root, builder.dirs.src.client),
            loader: path.resolve(__dirname, 'crusher-puller-loader'),
          },
<% } -%>
        ]
      },
      plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor-bundle.js'),
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
          compress: {
            warnings: false,
          },
          output: {
            comments: false,
          },
        })
      );
    }

    return conf;
  }

  createStream(opt, cb) {
    let conf = this.getConf(opt);
    conf.watch = opt.watch;
    return gulp.src(path.resolve(__dirname, 'null.js'))
      .pipe(webpackStream(conf, null, cb))<% if (use.crusher) { %>
      .pipe(this.builder.crusher.pusher({
        tagger: {
          relativeBase: path.join(this.builder.dirs.src.client, 'bundles')
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
      stats: { colors: true },
      // noInfo: true,
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




