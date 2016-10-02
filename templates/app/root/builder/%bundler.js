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
        filename: 'app.bundle.js',
      },
<% if (use.crusher) { -%>
      crusher: builder.crusher,
<% } -%>
      module: {
        loaders: [
          {
            test: scriptDir,
            loaders: ['babel-loader', 'eslint-loader'],
          },
          {
            test: testScriptDir,
            loaders: ['babel-loader', 'eslint-loader'],
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
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
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
    conf.entry.app.unshift(`webpack-dev-server/client?http://localhost:${8080}/`);
    let compiler = webpack(conf);
    let server = new WebpackDevServer(compiler, {
      publicPath: '/bundles/',
      stats: { colors: true },
      // noInfo: true,
    });
    let port = 8080;
    return new Promise(resolve => {
      server.listen(port, function() {
        gutil.log(`WepPack Dev Server listening on port ${port}.`);
        this.server = server;
        resolve();
      });
    });
  }
}

export default function(builder) {
  return new Bundler(builder);
}




