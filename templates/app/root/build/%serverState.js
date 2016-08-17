

export default function(build) {
  return {
    port: build.config.server.port || 8000,
    server: null,
    isActive() {
      return !!this.server;
    },
    start(done) {
      let server;
      done = done || function() {};
      if (this.isActive()) {
        gutil.log('server already running!');
        done();
        return;
      }
      let starter = require(`../${build.dirs.tgt.server}/scripts/startapp`);
      return server = starter({
        port: this.port,
        clientDir: build.dirs.tgt.client,
        vendorDir: build.dirs.tgt.clientVendor
        }, err => {
          if (!err) {
            this.server = server;
          }
          return done(err);
        }
      );
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
};


