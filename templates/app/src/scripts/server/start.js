import _ from 'lodash';
import http from 'http';

import setupFactory from './setup';
import appFactory from './app';


class Keeper {
  constructor() {
  }

  create(options) {
    const defaultOptions = setupFactory();
    this.options = _.defaultsDeep({}, options, defaultOptions.app);
    let app = appFactory(this.options);
    this.server = http.createServer(app);
  }

  shout() {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${this.options.port}`);
  }

  start() {
    this.server.listen(this.options.port);
  }

  startSafe() {
    return new Promise((resolve, reject) => {
      this.server.on('listening', () => {
        this.shout();
        resolve(this.server);
      });
      this.server.on('error', (err) => {
        reject(err);
      });
      this.start();
    });
  }

  attach() {
    this.server.on('listening', () => {
      this.shout();
      process.send({state: 'started'});
    });
    this.server.on('close', () => {
      process.send({state: 'stopped'});
    });
    this.server.on('error', (err) => {
      process.send({state: 'failed', error: err});
    });
  }

  wait() {
    process.on('message', (message) => {
      switch(message.cmd) {
      case 'start':
        this.create(message.options);
        this.attach();
        this.start();
        break;
      case 'stop':
        this.server.close();
        break;
      }
    });
  }

}

if (require.main === module) {
  let keeper = new Keeper();
  keeper.wait();
}

function start(options = {}) {
  let keeper = new Keeper();
  keeper.create(options);
  return keeper.startSafe();
}

export default start;
