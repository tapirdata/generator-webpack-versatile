
import path from 'path';
import fs from 'fs';
import json5 from 'json5';
import gutil from 'gulp-util';
import pluginsFactory from 'gulp-load-plugins';
import lazypipe from 'lazypipe';

import configFactory from './config';
import dirsFactory from './dirs';
import urlsFactory from './urls';
import globPatterns from './glob-patterns';
import serverFactory from './server';
import mochaFactory from './mocha';
import karmaFactory from './karma';
import syncFactory from './sync';
import bundlerFactory from './bundler';
<% if (use.modernizr) { -%>
import modernizrFactory from './modernizr';
<% } -%>

const plugins = pluginsFactory();
const config = configFactory();
const dirs = dirsFactory(path.resolve(__dirname, '..'), config);
const urls = urlsFactory(config);
const rootDir = path.join(__dirname, '..');


function handleError(err) {
  gutil.log(gutil.colors.red(`ERROR: ${err}`));
  return this.emit('end');
}

function getJson5(fname) {
  const absFname = path.join(rootDir, 'config', fname)
  return json5.parse(fs.readFileSync(absFname))
}

const builder = {
  config,
  dirs,
  globPatterns,
  watchEnabled: false,
  headlessEnabled: false,
  handleError,
  rootDir,
  plugins,
  serverBabelOptions: getJson5('babelrc-server.json5'),
  getJson5,

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
      return '<%= urls.staticBase %>/bundles';
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

  makeScriptPipe() {
    let jsFilter = plugins.filter([this.globPatterns.JS], {restore: true});
    let lp = lazypipe()
      .pipe(() => jsFilter)
      .pipe(plugins.eslint)
      .pipe(plugins.eslint.format)
      .pipe(plugins.babel, this.serverBabelOptions)
      .pipe(() => jsFilter.restore);
    return lp();
  },
};

<% if (use.crusher) { -%>
import cacheCrusher from 'cache-crusher';
builder.crusher = cacheCrusher({
  enabled: false,
  extractor: {
    urlBase: '<%= urls.staticBase %>/'
  },
  mapper: {
    counterparts: [{urlRoot: '<%= urls.staticBase %>', tagRoot: builder.dirs.src.root, globs: [
      '!vendor/**',
      '!images/favicon.ico',
      '!**/*.map',
    ]}]
  },
  resolver: {
    timeout: 20000
  }
});
<% } -%>


builder.server = serverFactory(builder);
builder.mocha = mochaFactory(builder);
builder.karma = karmaFactory(builder);
builder.sync = syncFactory(builder);
builder.bundler = bundlerFactory(builder);
<% if (use.modernizr) { -%>
builder.modernizr = modernizrFactory(builder);
<% } -%>

export default builder;

