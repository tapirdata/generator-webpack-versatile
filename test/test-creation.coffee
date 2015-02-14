###global describe, beforeEach, it ###

'use strict'
path = require('path')
helpers = require('yeoman-generator').test
describe 'express-develop generator', ->
  beforeEach (done) ->
    helpers.testDirectory path.join(__dirname, 'temp'), ((err) ->
      if err
        return done(err)
      @app = helpers.createGenerator('express-develop:app', [ '../../generators/app' ], [], 'test-framework': 'none')
      done()
      return
    ).bind(this)
    return
  it 'creates expected files', (done) ->
    expected = [
      '.jshint.json'
      '.editorconfig'
      '.gitignore'
      'src/client/images/favicon.ico'
      'src/client/pages/robots.txt'
      'src/client/pages/404.html'
    ]
    helpers.mockPrompt @app, 'features': []
    @app.options['skip-install'] = true
    @app.run ->
      helpers.assertFile expected
      done()
      return
    return
  return
