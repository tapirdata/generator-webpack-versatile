###global describe, beforeEach, it ###

'use strict'
path = require 'path'
fs = require 'fs'
child_process = require 'child_process'
_ = require 'lodash'
rimraf = require 'rimraf'
xml2js = require 'xml2js'
glob = require 'glob'
gutil = require 'gulp-util'
helpers = require 'yeoman-test'
assert = require 'yeoman-assert'
settings = require './settings'

class ProjectTestError extends Error
  name: 'ProjectTestError'
  constructor: (@fails) ->
    Object.defineProperty this, 'message', get: ->
      lines = _(@fails)
      .map (fail) ->
        [
          'class: ' + fail.classname
          'name:  ' + fail.name
          'cause: ' + fail.cause
        ]
      .flatten()
      .value()
      'ProjectTestError\n' + lines.join('\n')


backupRepos = (testDir, bakDir, cb) ->  
  rimraf bakDir, ->
    fs.mkdir bakDir, ->
      fs.rename path.join(testDir, 'bower_components'), path.join(bakDir, 'bower_components'), ->
        fs.rename path.join(testDir, 'node_modules'), path.join(bakDir, 'node_modules'), ->
          cb()

restoreRepos = (testDir, bakDir, cb) ->  
  fs.rename path.join(bakDir, 'bower_components'), path.join(testDir, 'bower_components'), ->
    fs.rename path.join(bakDir, 'node_modules'), path.join(testDir, 'node_modules'), ->
      cb()

testDirectoryFaster = (testDir, cb) ->
   bakDir = testDir + '.bak'
   backupRepos testDir, bakDir, ->
     helpers.testDirectory testDir, (err) ->
       if err
         cb(err)
         return
       restoreRepos testDir, bakDir, cb
       return


runAppTest = (cb) -> 
  appTest = child_process.spawn './node_modules/.bin/gulp', ['--env', 'test', 'test-ci']

  appTest.stdout.on 'data', (data) ->
    process.stdout.write data

  appTest.stderr.on 'data', (data) ->
    process.stderr.write 'ERROR: '
    process.stderr.write data

  appTest.on 'close', (code) ->
    assert code == 0, 'gulp test returns with code ' + code
    cb()

checkResults = (file, cb) ->
  fs.readFile file, (err, xml) ->
    if (err)
      cb(err)
      return
    xml2js.parseString xml, (err, result) -> 
      if (err)
        cb(err)
        return
      # console.log('result=', result)
      if result.testsuites
        suites = result.testsuites.testsuite
      else
        suites = [result.testsuite]
      # console.log('suites=', suites)
      assert.ok suites and suites.length > 0, 'no testsuite found' 
      fails = []
      for suite in suites
        do (suite) ->
          suiteAttributes = suite.$
          # console.log('suiteAttributes=', suiteAttributes)
          if Number(suiteAttributes.failures) > 0
            for testcase in suite.testcase
              do (testcase) ->
                if testcase.failure
                  testcaseAttributes = testcase.$
                  for failure in testcase.failure
                    do (failure) ->
                      fails.push
                        name: testcaseAttributes.name
                        classname: testcaseAttributes.classname
                        cause: failure._

      # console.log('fails=', fails)
      if fails.length
        throw new ProjectTestError fails
      cb()
      return

for ts in settings.testSettings
  do (ts) ->
    if not ts.full
      return
    SC_EXT = if ts.coffee then '.coffee' else '.js'
    STYLE_EXT = if ts.sass then '.sass' else '.css'
    describe 'browserify-versatile generator ' + ts.toString(), ->
      @timeout 5 * 60 * 1000
      serverResultsFile = null
      clientResultsFile = null
      testDir = path.join(__dirname, 'project')
      resultsDir = path.join(testDir, 'results')
      before (done) ->
        testDirectoryFaster testDir, (err) =>
          @app = helpers.createGenerator(
            'browserify-versatile:app',
            [ '../../generators/app' ],
            []
          )
          done()
          return
        return
      it 'runs the project tests', (done) ->
        helpers.mockPrompt @app,
          features: ts.activeFeatures()
        # @app.options['skip-install'] = true
        @app.run ->
          runAppTest done
          return
        return
      it 'run tests without server failures', (done) ->
        serverResultsFile = path.join(resultsDir, 'server.xml')
        assert.file serverResultsFile
        checkResults serverResultsFile, done
      for browserName in ['PhantomJS']  
        it "run tests without client failures for '#{browserName}'" , (done) ->
          glob path.join(resultsDir, browserName + '*', 'client.xml'), (err, clientResultsFiles) ->
            gutil.log "clientResultsFiles=#{clientResultsFiles}"
            assert err == null, 'cannot read "client.xml"'
            assert clientResultsFiles.length == 1, 'missing or multiple "client.xml"'
            clientResultsFile = clientResultsFiles[0]
            assert.file clientResultsFile
            checkResults clientResultsFile, done
      return
