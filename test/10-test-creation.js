/* eslint-env mocha  */

import path from 'path';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import settings from './settings';

for (let i = 0; i < settings.length; i++) {
  let ts = settings[i];
  (function(ts) {
    let STYLE_EXT = ts.sass ? '.sass' : '.css';
    return describe(`browserify-versatile generator ${ts.toString()}`, function() {
      before(function(done) {
        // @timeout 1000
        helpers.testDirectory(path.join(__dirname, 'temp'), err => {
          if (err) {
            done(err);
            return;
          }
          this.app = helpers.createGenerator('browserify-versatile:app', [ '../../generators/app' ], [], {'test-framework': 'none'});
          // console.log "app=#{@app} features=#{ts.activeFeatures()}"
          helpers.mockPrompt(this.app, {'features': ts.activeFeatures()});
          done();
        }
        );
      });
      if (ts.unsupported) {
        it('expected to be unsupported', done =>
          //TODO: assert error
          done()

        );
      } else {
        it('creates expected files', function(done) {
          let expected = [
            '.bowerrc',
            'bower.json',
            '.editorconfig',
            '.gitignore',
            'gulpfile.babel.js',
            '.babelrc',
            '.eslintrc.js',
            'package.json',
            'README.md',
            'config/default.json',
            'config/development.json',
            'config/production.json',
            'config/testing.json',
            'src/server/scripts/routes/main.js',
            'src/server/scripts/app.js',
            'src/server/scripts/setup.js',
            'src/server/scripts/start.js',
            'src/server/templates/layout.pug',
            'src/server/templates/index.pug',
            'src/client/images/favicon.ico',
            'src/client/pages/robots.txt',
            'src/client/pages/404.html',
            'src/client/scripts/main.js',
            'src/client/scripts/app-starter.js',
            `src/client/styles/main${STYLE_EXT}`
          ];
          if (ts.backbone) {
            expected = expected.concat([
              'src/client/scripts/router.js',
              'src/client/scripts/views/simple.js',
              'src/client/templates/home.pug',
              'src/client/templates/about.pug',
              'src/client/templates/contact.pug',
              'src/client/templates/dummy.pug'
            ]);
          } else {
            expected = expected.concat([
              'src/server/templates/about.pug',
              'src/server/templates/contact.pug'
            ]);
          }
          // console.log(expected)
          this.app.options['skip-install'] = true;
          return this.app.run(function() {
            assert.file(expected);
            done();
          });
        }
        );
        return;
      }
    }
    );
  })(ts);
}
