import gutil from 'gulp-util';

export default function(build) {
  return {
    port: build.config.server.port || 8000,
    server: null,
    isActive() {
      return !!this.server;
    },
    start() {
      // gutil.log('serverState start');
      return Promise.resolve() 
      .then(() => {
        if (this.isActive()) {
          gutil.warn('server already running!');
          return;
        }
        let starter = require(`../${build.dirs.tgt.server}/scripts/start`).default;
        return starter({})
        .then(server => {
          // gutil.log('serverState started');
          this.server = server;
        });
      });
    },
    stop() {
      return new Promise((resolve, reject) => {
        if (this.isActive()) {
          this.server.close(err => {
            this.server = null;
            if (err) reject(err);
            else resolve();
          });
        } else {
          gutil.warn('no server running!');
          resolve();
        }
      });
    },
    restart() {
      return this.stop()
      .then(() => {
        return this.start();
      });
    },
  };
}


