import path from 'path';
import mkdirp from 'mkdirp';
import glob from 'glob';
import _ from 'lodash';
import gulp from 'gulp';
import pluginsFactory from 'gulp-load-plugins';
import browserify from 'browserify';
import watchify from 'watchify';
import uglifyify from 'uglifyify';
import exorcist from 'exorcist';
import source from 'vinyl-source-stream';

const plugins = pluginsFactory();

export default function(build) {

  return function(bundleDefs, options) {

    let resolveNames = function(names) {
      let _names = [];
      if (names) {
        if (!_.isArray(names)) {
          names = [names];
        }
        _.forEach(names, function(name) {
          if (/[*]/.test(name)) {
            return _names = _names.concat(glob.sync(name));
          } else {
            return _names.push(name);
          }
        }
        );
      }
      return _names;
    };


    options = options || {};
    let exportNames = {};
    let bundles = _.map(bundleDefs, function(bundleDef) {
      let bundle = {
        name: bundleDef.name,
        entries: resolveNames(bundleDef.entries),
        transform: bundleDef.transform,
        extensions: bundleDef.extensions,
        debug: bundleDef.debug,
        destDir: bundleDef.destDir || `${build.dirs.tgt.client}/scripts`,
        destName: bundleDef.destName || `${bundleDef.name}.js`,
        doWatch: bundleDef.watchable && options.doWatch,
        exportNames: {}
      };

      if (bundleDef.exports) {
        bundle.exports = _.map(bundleDef.exports, function(exp) {
          if (!_.isObject(exp)) {
            exp =
              {name: exp};
          }
          if (!exp.alias) {
            exp.alias = exp.name;
          }
          bundle.exportNames[exp.alias] = true;
          exportNames[exp.alias] = true;
          return exp;
        }
        );
      } else {
        bundle.exports = [];
      }

      return bundle;
    }
    );

    let promises = [];
    bundles.forEach(function(bundle) {
      // gutil.log('bundle=', bundle)

      let b = browserify({
        cache: {},
        entries: bundle.entries,
        extensions: bundle.extensions,
        transform: bundle.transform,
        debug: bundle.debug
      });

      _.forOwn(exportNames, function(ok, name) {
        if (!bundle.exportNames[name]) {
          // gutil.log 'external: ', name
          return b.external(name);
        }
      }
      );

      _.forEach(bundle.exports, function(exp) {
          // gutil.log 'export: ', exp
          let expOpts = {};
          if (exp.alias !== exp.name) {
            expOpts.expose = exp.alias;
          }
          return b.require(exp.name, expOpts);
        }
      );

      if (bundle.doWatch) {
        b = watchify(b);
        b.on('update', file =>
          // gutil.log 'Rebuild bundle: ' + gutil.colors.blue(bundle.name)
          buildIt()
            .pipe(build.streams.reloadClient())
        
        );
      }

      var buildIt = function() {
        if (build.config.mode.isProduction) {
          b = b.transform({
            sourcemap: true,
            global: true
          },
            uglifyify);
        }
        let stream = b.bundle()
        .on('error', build.handleError);

        if (bundle.debug) {
          stream = stream
            .pipe(plugins.tap(() => mkdirp.sync(bundle.destDir))
          )
            .pipe(exorcist(path.join(bundle.destDir, bundle.destName + '.map')));
        }

        return stream
          .pipe(source(bundle.destName))<% if (use.crusher) { %>
          .pipe(build.crusher.puller())
          .pipe(build.crusher.pusher({tagger: { relativeBase: path.join(build.dirs.src.client, 'scripts')
        }}))<% } %>
          .pipe(gulp.dest(bundle.destDir));
      };


      return promises.push(new Promise((resolve, recect) =>
        buildIt()
          .pipe(plugins.tap(() =>
            resolve()
          )
        )
      )
      );
    });

    return Promise.all(promises);
  };
};


