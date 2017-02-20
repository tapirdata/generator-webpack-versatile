
import path from 'path';
import gutil from 'gulp-util';
import pluginsFactory from 'gulp-load-plugins';

import configFactory from './config';
import dirsFactory from './dirs';
import globPatterns from './glob-patterns';
import serverFactory from './server';
import mochaFactory from './mocha';
import karmaFactory from './karma';
import syncFactory from './sync';
import BundlerFactory from './bundler';
<% if (use.modernizr) { -%>
import modernizrFactory from './modernizr';
<% } -%>

const plugins = pluginsFactory();
const config = configFactory();
const dirs = dirsFactory(path.resolve(__dirname, '..'), config);

function handleError(err) {
  gutil.log(gutil.colors.red(`ERROR: ${err}`));
  return this.emit('end');
}

const builder = {
  config,
  dirs,
  globPatterns,
  watchEnabled: false,
  headlessEnabled: false,
  handleError,
  rootDir: path.join(__dirname, '..'),
  joinRelative(fromParts, toParts) {
    return path.relative(
        path.join.apply(null, toParts),
        path.join.apply(null, fromParts),
        );
  },
  getBundleUrl() {
    if (this.watchEnabled) {
      const serverOptions = builder.bundler.serverOptions;
      return `http://${serverOptions.host}:${serverOptions.port}/bundles`;
    } else {
      return '/app/bundles';
    }
  },

  plumber() {
    return plugins.plumber({
      errorHandler(err) {
        gutil.log(
          gutil.colors.red('Error:\n'),
          err.toString()
        );
        return this.emit('end');
      }
    });
  },

};

<% if (use.crusher) { -%>
import cacheCrusher from 'cache-crusher';
builder.crusher = cacheCrusher({
  enabled: false,
  extractor: {
    urlBase: '/app/'
  },
  mapper: {
    counterparts: [{urlRoot: '/app', tagRoot: builder.dirs.src.client, globs: ['!images/favicon.ico', '!**/*.map']}]
  },
  resolver: {
    timeout: 20000
  }
});
builder.crusher.extractorOptions.catalog.registerExts('html', '.pug');
<% } -%>


builder.server = serverFactory(builder);
builder.mocha = mochaFactory(builder);
builder.karma = karmaFactory(builder);
builder.sync = syncFactory(builder);
builder.bundler = BundlerFactory(builder);
<% if (use.modernizr) { -%>
builder.modernizr = modernizrFactory(builder);
<% } -%>

export default builder;

