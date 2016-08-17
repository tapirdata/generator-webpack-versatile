
import _ from 'lodash';
import minimist from 'minimist';
import gutil from 'gulp-util';

import modeFactory from './mode';
import dirsFactory from './dirs';
import globPatterns from './globPatterns';
import bundleDefsFactory from './bundleDefs';
import serverStateFactory from './serverState'
import mochaStateFactory from './mochaState'
import karmaStateFactory from './karmaState'
import streamsFactory from './streams'
import buildBrowsifiedFactory from './buildBrowsified'
<% if (use.modernizr) { -%>
import modernizrFactory from './modernizr';
<% } -%>
import config from 'config';

const argv = minimist(process.argv.slice(2));
const mode = modeFactory(argv.env); // sets process.NODE_ENV
const dirs = dirsFactory(config);  // config uses process.NODE_ENV

function handleError(err) {
  gutil.log(gutil.colors.red(`ERROR: ${err}`));
  return this.emit('end');
};

const build = {
  argv,
  mode,
  config,
  dirs,
  globPatterns,
  watchEnabled: false,
  headlessEnabled: false,
  handleError
};

<% if (use.crusher) { -%>
import cacheCrusher from 'cache-crusher';
build.crusher = cacheCrusher({
  enabled: false,
  extractor: {
    urlBase: '/app/'
  },
  mapper: {
    counterparts: [{urlRoot: '/app', tagRoot: build.dirs.src.client, globs: '!images/favicon.ico'}]
  },
  resolver: {
    timeout: 20000
  }
});<% } -%>

const bundleDefs = bundleDefsFactory(build);

build.getBundleDefs = scope =>
  _.filter(bundleDefs, bundleDef => !scope || !bundleDef.scopes || _.indexOf(bundleDef.scopes, scope) >= 0
  )
;

build.serverState = serverStateFactory(build);
build.mochaState = mochaStateFactory(build);
build.karmaState = karmaStateFactory(build);
build.streams = streamsFactory(build);
build.buildBrowsified = buildBrowsifiedFactory(build);
<% if (use.modernizr) { -%>
build.modernizr = modernizrFactory(build);
<% } -%>

export default build;

