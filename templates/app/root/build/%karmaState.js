import _ from 'lodash';
import karma from 'karma';


export default function(build) {

  return {
    server: null,
    browsers: build.config.karma.browsers,
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
    start(options, done) {
      let karmaConf = {
        urlRoot: '/__karma__/',
        files: [
          {
            pattern: `${build.dirs.tgt.client}/scripts/vendor?(-+([a-f0-9])).js`,
            watched: false
          },
          {
            pattern: `${build.dirs.tgt.client}/test/scripts/main?(-+([a-f0-9])).js`
          }
        ],
        frameworks: [
         'mocha'
        ],
        browsers: build.headlessEnabled ? this.browsers.ci : this.browsers.work,
        reporters: build.headlessEnabled ? this.reporters.ci : this.reporters.work,
        junitReporter: {
          outputDir: 'results',
          outputFile: 'client.xml'
        },
        proxies: {
          '/': `http://localhost:${build.serverState.port}/`
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

      // gutil.log 'karma start...'
      let karmaServer = new karma.Server(karmaConf, exitCode => {
        // gutil.log 'karma start done. code=%s', exitCode
        this.server = null;
        if (done) {
          return done();
        }
      }
      );
      karmaServer.start();    
      return this.server = true;
    },

    run: _.debounce(
      done =>
        // gutil.log 'karma run...'
        karma.runner.run({}, function(exitCode) {
          // gutil.log 'karma run done. code=%s', exitCode
          if (done) {
            return done();
          }
        }
        )
      ,
      1000)
  };
};



