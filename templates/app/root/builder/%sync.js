import gutil from 'gulp-util';
import pluginsFactory from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const plugins = pluginsFactory();


class Sync {

  constructor(builder) {
    this.builder = builder;
    this.bs = browserSync.create();
  }

  isActive() {
    return this.bs.active;
  }

  enable() {
    self.enabled = true;
  }

  start() {
    if (this.isActive()) {
      return Promise.resolve();
    }
    const builder = this.builder;
    const conf = {
      proxy: `localhost:${builder.server.port}`,
      browser: builder.config.browserSync.browser
    };
    return new Promise((resolve, reject) => {
      this.bs.init(conf, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  reloadServer() {
    return plugins.tap(() => {
      if (this.builder.server.isActive()) {
        return this.builder.server.restart()
        .then(() => {
          if (this.isActive()) {
            gutil.log('bs.reload');
            this.bs.reload();
          }
          return this.builder.karma.rerun();
        });
      }
    });
  }

  reloadClient() {
    if (this.isActive()) {
      return this.bs.stream();
    } else {
      return plugins.tap(() => {
        return this.builder.karma.rerun();
      });
    }
  }
}

export default function(builder) {
  return new Sync(builder);
}


