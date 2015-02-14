###global describe, beforeEach, it ###

'use strict'
path = require('path')
fs = require('fs')
child_process = require('child_process')
rimraf = require('rimraf')
xml2js = require('xml2js')
helpers = require('yeoman-generator').test
assert = require('yeoman-generator').assert
settings = require('./settings')

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

runAppTest = (cb) -> 
  appTest = child_process.spawn 'gulp', ['test']

  appTest.stdout.on 'data', (data) ->
    console.log data.toString()

  appTest.stderr.on 'data', (data) ->
    console.log 'ERROR:' + data

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
        err = new Error JSON.stringify(fails) #TODO: nicify this!
        cb(err)
        return

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
        bakDir = path.join(__dirname, '.project')
        backupRepos testDir, bakDir, => 
          helpers.testDirectory testDir, (err) =>
            if err
              done(err)
              return 
            restoreRepos testDir, bakDir, => 
              @app = helpers.createGenerator('express-develop:app', [ '../../generators/app' ], [], 'test-framework': 'none')
              done()
              return
            return
          return
        return
      it 'runs the project test', (done) ->
        @timeout 5 * 60 * 1000
        helpers.mockPrompt @app, 'features': ts.activeFeatures(), amdLib: ts.amd
        @app.options['skip-install'] = true
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


