import gutil from 'gulp-util';
import pluginsFactory from 'gulp-load-plugins';
import browserSync from 'browser-sync';

let plugins = pluginsFactory();

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
      // gutil.log('reloadServer...');
      return plugins.tap(() => {
        if (build.serverState.isActive()) {
          return build.serverState.restart()
          .then(() => {
            if (browserSync.active) {
              browserSync.reload();
            }
            return build.karmaState.rerun();
          });
        }
      });
    },

    reloadClient() {
      // gutil.log('reloadClient...');
      if (browserSync.active) {
        return browserSync.reload({stream: true});
      } else {
        return plugins.tap(() => {
          return build.karmaState.rerun();
        });
      }
    },

  };
}


