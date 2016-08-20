
import path from 'path';
import _ from 'lodash';
import minimist from 'minimist';
import gutil from 'gulp-util';

import configFactory from './config';
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

const config = configFactory();
const dirs = dirsFactory(config);

function handleError(err) {
  gutil.log(gutil.colors.red(`ERROR: ${err}`));
  return this.emit('end');
};

const build = {
  config,
  dirs,
  globPatterns,
  watchEnabled: false,
  headlessEnabled: false,
  handleError,
  rootDir: path.join(__dirname, '..'),
  getRelPath(fromFilename, opts) {
    const dirs = this.dirs;
    const {
      to,
      fromSourceBase = dirs.test.server,
      fromDestBase = dirs.tgt.serverTest,
      toDestBase = dirs.tgt.server
    } = opts;
    const fromBaseRel = path.relative(path.dirname(fromFilename), fromSourceBase);
    const destBaseRel = path.relative(fromDestBase, toDestBase);
    return path.join(fromBaseRel, destBaseRel, to);
  }
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

