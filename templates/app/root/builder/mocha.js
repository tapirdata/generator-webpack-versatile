import path from 'path';
import gulp from 'gulp';
let plugins = require('gulp-load-plugins')();

export default function(builder) {

  return {
    start() {
      this.isActive = true;
      let reporter = builder.headlessEnabled ?
        (process.env.JUNIT_REPORT_PATH = path.join(builder.dirs.tmp, 'test-results', 'server.xml'),
        'mocha-jenkins-reporter')
      :
        'spec';
      return (
        gulp.src(builder.globPatterns.TEST, {
          cwd: `${builder.dirs.tgt.server}/test/scripts`,
          read: false
        }
        )
      )
        .pipe(builder.plumber())
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
        if (builder.watchEnabled) {
          return this.rerun();
        }
      });
    },

  };
}

