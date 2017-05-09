import path from 'path';
import childProcess from 'child_process';
import gutil from 'gulp-util';


export default function(builder) {
  return {
    port: builder.config.server.port || 8000,
    server: null,
    callBacks: {},

    isActive() {
      return !!this.srvChild;
    },

    registerCallBack(name, cb) {
      let nameCallBacks = this.callBacks[name];
      if (!nameCallBacks) {
        this.callBacks[name] = nameCallBacks = [];
        nameCallBacks.push(cb);
      }
    },

    fireCallBacks(name, message) {
      let nameCallBacks = this.callBacks[name];
      this.callBacks = {};
      if (nameCallBacks) {
        for (let cb of nameCallBacks) {
          cb.call(this, message);
        }
      }
    },

    start() {
      gutil.log('starting server...');
      if (this.isActive()) {
        gutil.log('server already running!');
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        let startPath = path.resolve(__dirname, `../${builder.dirs.tgt.server}/scripts/start`);
        let srvChild = childProcess.fork(startPath);
        srvChild.on('message', (message) => {
          // console.log('server sent:', message);
          if (message) {
            this.fireCallBacks(message.state, message);
          }
        });
        this.registerCallBack('started', function() {
          gutil.log('server started.');
          this.srvChild = srvChild;
          resolve();
        });
        this.registerCallBack('failed', function(message) {
          gutil.log('server failed:', message.error);
          srvChild.kill();
          reject();
        });
        srvChild.send({
          cmd: 'start',
          options: {
            port: this.port
          }
        });
      });
    },

    stop() {
      gutil.log('stopping server...');
      if (!this.isActive()) {
        gutil.log('no server running!');
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        this.registerCallBack('stopped', function(message) {
          let error = message.error;
          gutil.log('server stopped.%s', error == null ? '' : ` error=${error}`);
          this.srvChild = null;
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
        this.srvChild.send({cmd: 'stop'});
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


