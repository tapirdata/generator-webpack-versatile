/*global describe, beforeEach, it */

import path from 'path';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import settings from './settings';

for (let i = 0; i < settings.length; i++) {
  let ts = settings[i];
  (function(ts) {
    let SC_EXT = '.coffee';   //TODO: '.js';
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
            `gulpfile${SC_EXT}`,
            '.jshint.json',
            'package.json',
            'README.md',
            `config/default${SC_EXT}`, 
            `config/development${SC_EXT}`, 
            `config/production${SC_EXT}`, 
            `config/testing${SC_EXT}`, 
            `src/server/scripts/routes/main${SC_EXT}`,
            `src/server/scripts/app-factory${SC_EXT}`,
            `src/server/scripts/startapp${SC_EXT}`,
            'src/server/templates/layout.jade',
            'src/server/templates/index.jade',
            'src/client/images/favicon.ico',
            'src/client/pages/robots.txt',
            'src/client/pages/404.html',
             `src/client/scripts/main${SC_EXT}`,
            `src/client/scripts/app-starter${SC_EXT}`,
            `src/client/styles/main${STYLE_EXT}`
          ];
          if (ts.backbone) {
            expected = expected.concat([
             `src/client/scripts/router${SC_EXT}`,
             `src/client/scripts/views/simple${SC_EXT}`,
             'src/client/templates/home.jade',
             'src/client/templates/about.jade',
             'src/client/templates/contact.jade',
             'src/client/templates/dummy.jade'
            ]);
          } else {  
            expected = expected.concat([
              'src/server/templates/about.jade',
              'src/server/templates/contact.jade'
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
