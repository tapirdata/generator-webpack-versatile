import gulp from 'gulp';
let plugins = require('gulp-load-plugins')();

export default function(build) {

  return {
    start() {
      this.isActive = true;
      let reporter = build.headlessEnabled ?
        (process.env.JUNIT_REPORT_PATH = 'results/server.xml',
        'mocha-jenkins-reporter')
      :
        'spec';
      return (
        gulp.src(build.globPatterns.TEST, {
          cwd: `${build.dirs.tgt.server}/test/scripts`,
          read: false
        }
        )
      )
        .pipe(build.streams.plumber())
        .pipe(plugins.mocha({
          reporter})
      );
    },

    rerun() {
      if (this.isActive) {
        return this.start();
      }
    },

    rerunIfWatch() {
      return plugins.tap(() => {
        if (build.watchEnabled) {
          return this.rerun();
        }
      });
    },

  };
}

