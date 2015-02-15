###global describe, beforeEach, it ###

'use strict'
path = require('path')
fs = require('fs')
child_process = require('child_process')
_ = require('lodash')
rimraf = require('rimraf')
xml2js = require('xml2js')
helpers = require('yeoman-generator').test
assert = require('yeoman-generator').assert
settings = require('./settings')

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
  appTest = child_process.spawn 'gulp', ['--env', 'test', 'test-ci']

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
      suites = result.testsuites.testsuite
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

      console.log('fails=', fails)
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
    describe 'express-develop generator ' + ts.toString(), ->
      testDir = path.join(__dirname, 'project')
      before (done) ->
        testDirectoryFaster testDir, (err) =>
          @app = helpers.createGenerator(
            'express-develop:app',
            [ '../../generators/app' ],
            []
          )
          done()
          return
        return
      it 'runs the project test', (done) ->
        @timeout 5 * 60 * 1000
        helpers.mockPrompt @app,
          features: ts.activeFeatures()
          amdLib: ts.amd
        # @app.options['skip-install'] = true
        @app.run ->
          runAppTest (err) ->
            if err
              done(err)
              return
            testResultsFile = path.join(testDir, 'test-results.xml')
            assert.file testResultsFile
            checkResults testResultsFile, done
            return
          return
        return
      return


