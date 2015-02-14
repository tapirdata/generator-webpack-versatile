###global describe, beforeEach, it ###

'use strict'
path = require('path')
helpers = require('yeoman-generator').test
settings = require('./settings')

for ts in settings.testSettings
  do (ts) ->
    if ts.unsupported
      return
    SC_EXT = if ts.coffee then '.coffee' else '.js'
    STYLE_EXT = if ts.sass then '.sass' else '.css'
    describe 'express-develop generator ' + ts.toString(), ->
      before (done) ->
        # @timeout 1000
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
          '.bowerrc'
          'bower.json'
          '.editorconfig'
          '.gitignore'
          'gulpfile' + SC_EXT
          '.jshint.json'
          'package.json'
          'config/default' + SC_EXT 
          'config/development' + SC_EXT 
          'config/production' + SC_EXT 
          'config/testing' + SC_EXT 
          'src/server/scripts/routes/main' + SC_EXT
          'src/server/scripts/app-factory' + SC_EXT
          'src/server/scripts/startapp' + SC_EXT
          'src/server/templates/layout.jade'
          'src/server/templates/index.jade'
          'src/client/images/favicon.ico'
          'src/client/pages/robots.txt'
          'src/client/pages/404.html'
          'src/client/scripts/app' + SC_EXT
          'src/client/styles/main' + STYLE_EXT
        ]
        if ts.backbone
          expected = expected.concat([
           'src/client/scripts/main.tpl' + SC_EXT
           'src/client/scripts/router' + SC_EXT
           'src/client/scripts/views/simple' + SC_EXT
           'src/client/templates/home.jade'
           'src/client/templates/about.jade'
           'src/client/templates/contact.jade'
           'src/client/templates/dummy.jade'
          ])
        else  
          expected = expected.concat([
            'src/server/templates/about.jade'
            'src/server/templates/contact.jade'
          ])
        # console.log(expected)
        helpers.mockPrompt @app, 'features': ts.activeFeatures(), amdLib: ts.amd
        @app.options['skip-install'] = true
        @app.run ->
          helpers.assertFile expected
          done()
          return
        return
      return
