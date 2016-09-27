import path from 'path';
import gutil from 'gulp-util';
import karma from 'karma';


export default function(builder) {

  return {
    server: null,
    browsers: builder.config.karma.browsers,
    reporters: {
      work: [
        'mocha'
      ],
      ci: [
        'mocha',
        'junit'
      ]
    },

    isActive() {
      return !!this.server;
    },

    start(options) {
      let karmaConf = {
        urlRoot: '/__karma__/',
        files: [
          {
            pattern: `${builder.dirs.tgt.client}/bundles/vendor.bundle?(-+([a-f0-9])).js`,
            watched: false,
          },
          {
            pattern: `${builder.dirs.tgt.client}/bundles/app.bundle?(-+([a-f0-9])).js`,
            watched: false,
          }
        ],
        frameworks: [
          'mocha'
        ],
        browsers: builder.headlessEnabled ? this.browsers.ci : this.browsers.work,
        reporters: builder.headlessEnabled ? this.reporters.ci : this.reporters.work,
        junitReporter: {
          outputDir: path.join(builder.dirs.tmp, 'test-results'),
          outputFile: 'client.xml'
        },
        proxies: {
          '/': `http://localhost:${builder.server.port}/`
        },
        client: {
          captureConsole: true,
          mocha: {
            bail: true
          }
        },
        singleRun: options.singleRun,
        browserNoActivityTimeout: 10000
      };

      this.karmaConf = karmaConf;

      return new Promise((resolve) => {
        this.server = new karma.Server(karmaConf, (exitCode) => {
          // gutil.log('karma start done. code=%s', exitCode);
          this.server = null;
          resolve(exitCode);
        });
        this.server.start();
      });

    },

    rerun() {
      // gutil.log('karma rerun');
      if (!this.isActive()) {
        return Promise.resolve();
      }
      let karmaConf = this.karmaConf;
      return new Promise((resolve) => {
        karma.runner.run(karmaConf, (exitCode) => {
          gutil.log('karma rerun done. code=%s', exitCode);
          resolve(exitCode);
        });
      });
    },
  };
}



