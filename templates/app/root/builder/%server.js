import gutil from 'gulp-util';

export default function(builder) {
  return {
    port: builder.config.server.port || 8000,
    server: null,

    isActive() {
      return !!this.server;
    },

    start() {
      gutil.log('server start..');
      return Promise.resolve() 
      .then(() => {
        if (this.isActive()) {
          gutil.warn('server already running!');
          return;
        }
        let starter = require(`../${builder.dirs.tgt.server}/scripts/start`).default;
        return starter({})
        .then(server => {
          gutil.log('server started.');
          this.server = server;
        });
      });
    },
    
    stop() {
      gutil.log('server stop...');
      return new Promise((resolve, reject) => {
        if (this.isActive()) {
          this.server.close(err => {
            gutil.log('server stopped.%s', err == null ? '' : ` err=${err}`);
            this.server = null;
            if (err) {
              reject(err);
            } else {  
              resolve();
            }
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


