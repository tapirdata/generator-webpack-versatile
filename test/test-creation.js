/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('express-develop generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }
      this.app = helpers.createGenerator('express-develop:app', [
          '../../generators/app',
        ],
        [],
        {'test-framework': 'none'}
      );
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      '.jshint.json',
      '.editorconfig',
      '.gitignore',
      'src/client/images/favicon.ico',
      'src/client/pages/robots.txt',
      'src/client/pages/404.html'
    ];

    helpers.mockPrompt(this.app, {
      'features': []
    });
    this.app.options['skip-install'] = true;
    this.app.run(function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
