let plugins = require('gulp-load-plugins')();
import browserSync from 'browser-sync';
import gutil from 'gulp-util';

export default function(build) {

  return {
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

    reloadServer() {
      return plugins.tap(function() {
        if (build.serverState.isActive()) {
          return build.serverState.restart(function() {
            if (browserSync.active) {
              browserSync.reload();
            }
            if (build.karmaState.isActive()) {
              return build.karmaState.run();
            }
          });
        }
      });
    },


    reloadClient() {
      if (browserSync.active) {
        return browserSync.reload({stream: true});
      } else {
        return plugins.tap(function() {
          if (build.karmaState.isActive()) {
            return build.karmaState.run();
          }
        });
      }
    },

    rerunMocha(options) {
      return plugins.tap(function() {
        if (build.watchEnabled) {
          return build.mochaState.restart();
        }
      });
    }
  };
};


