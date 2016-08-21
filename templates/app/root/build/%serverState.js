import gutil from 'gulp-util';

export default function(build) {
  return {
    port: build.config.server.port || 8000,
    server: null,
    isActive() {
      return !!this.server;
    },
    start(done) {
      done = done || function() {};
      if (this.isActive()) {
        gutil.log('server already running!');
        done();
        return;
      }
      let starter = require(`../${build.dirs.tgt.server}/scripts/start`).default;
      starter({})
      .then(server => {
        this.server = server;
        done();
      })
      .catch(err => done(err));
    },

    stop(done) {
      done = done || function() {};
      if (this.isActive()) {
        return this.server.close(err => {
          // gutil.log 'server stopped.'
          this.server = null;
          done(err);
        }
        );
      } else {
        gutil.log('no server running!');
        done();
        return;
      }
    },

    restart(done) {
      done = done || function() {};
      return this.stop(err => {
        if (err) {
          return done(err);
        } else {
          return this.start(function(err) {
            done(err);
          });
        }
      }
      );
    }
  };
}


