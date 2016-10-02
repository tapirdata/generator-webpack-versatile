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
        if (answers.framework === 'backbone' || answers.framework === 'marionette') {
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
