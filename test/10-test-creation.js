/* eslint-env mocha  */

import path from 'path';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import settings from './settings';

for (let ts of settings) {
  const answers = ts.getAnswers();
  const STYLE_EXT = answers.features.indexOf('sass') >= 0 ? '.sass' : '.css';
  describe(`webpack-versatile generator ${ts.toString()}`, function() {
    let app;
    before(done => {
      // @timeout 1000
      helpers.testDirectory(path.join(__dirname, 'temp'), err => {
        if (err) {
          done(err);
          return;
        }
        app = helpers.createGenerator('webpack-versatile:app', [ '../../generators/app' ], [], {'test-framework': 'none'});
        helpers.mockPrompt(app, answers);
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
          'src/scripts/server/routes/main.js',
          'src/scripts/server/app.js',
          'src/scripts/server/setup.js',
          'src/scripts/server/start.js',
          'src/templates/layout.pug',
          'src/templates/index.pug',
          'src/templates/sections/home.pug',
          'src/templates/sections/about.pug',
          'src/templates/sections/contact.pug',
          'src/images/favicon.ico',
          'src/pages/robots.txt',
          'src/pages/404.html',
          'src/scripts/client/main.js',
          'src/scripts/client/app-starter.js',
          `src/styles/main${STYLE_EXT}`
        ];
        if (answers.framework === 'backbone' || answers.framework === 'marionette') {
          expected = expected.concat([
            'src/scripts/client/router.js',
            'src/scripts/client/views/index.js',
          ]);
        }
        // console.log(expected)
        app.options['skip-install'] = true;
        return app.run(function() {
          assert.file(expected);
          done();
        });
      }
      );
      return;
    }
  });
}
