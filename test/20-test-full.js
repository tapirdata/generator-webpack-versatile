/* eslint-env mocha  */

import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import _ from 'lodash';
import rimraf from 'rimraf';
import xml2js from 'xml2js';
import glob from 'glob';
import gutil from 'gulp-util';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import settings from './settings';

class ProjectTestError extends Error {
  constructor(fails) {
    super();
    this.fails = fails;
    Object.defineProperty(this, 'message', { get() {
      let lines = _(this.fails)
      .map(fail =>
        [
          `class: ${fail.classname}`,
          `name:  ${fail.name}`,
          `cause: ${fail.cause}`
        ])
      .flatten()
      .value();
      return `ProjectTestError\n${lines.join('\n')}`;
    }});
  }
}

ProjectTestError.prototype.name = 'ProjectTestError';


function backupRepos(testDir, bakDir, cb) {
  return rimraf(bakDir, () =>
    fs.mkdir(bakDir, () =>
      fs.rename(path.join(testDir, 'bower_components'), path.join(bakDir, 'bower_components'), () =>
        fs.rename(path.join(testDir, 'node_modules'), path.join(bakDir, 'node_modules'), () => cb()
        )
      )
    )
  );
}

function restoreRepos(testDir, bakDir, cb) {
  return fs.rename(path.join(bakDir, 'bower_components'), path.join(testDir, 'bower_components'), () =>
    fs.rename(path.join(bakDir, 'node_modules'), path.join(testDir, 'node_modules'), () => cb()
    )
  );
}

function testDirectoryFaster(testDir, cb) {
  let bakDir = testDir + '.bak';
  return backupRepos(testDir, bakDir, () =>
    helpers.testDirectory(testDir, function(err) {
      if (err) {
        cb(err);
        return;
      }
      restoreRepos(testDir, bakDir, cb);
    })
  );
}


function runAppTest(cb) {
  let appTest = child_process.spawn('./node_modules/.bin/gulp', ['--env', 'test', 'test-ci']);

  appTest.stdout.on('data', data => process.stdout.write(data)
  );

  appTest.stderr.on('data', function(data) {
    process.stderr.write('ERROR: ');
    return process.stderr.write(data);
  });

  return appTest.on('close', function(code) {
    assert(code === 0, `gulp test returns with code ${code}`);
    return cb();
  });
}

function checkResults(file, cb) {
  return fs.readFile(file, function(err, xml) {
    if (err) {
      cb(err);
    }
    return xml2js.parseString(xml, function(err, result) {
      if (err) {
        cb(err);
      }
      let suites;
      if (result.testsuites) {
        suites = result.testsuites.testsuite;
      } else {
        suites = [result.testsuite];
      }
      assert.ok(suites && suites.length > 0, 'no testsuite found');
      let fails = [];
      for (let i = 0; i < suites.length; i++) {
        let suite = suites[i];
        (function(suite) {
          let suiteAttributes = suite.$;
          if (Number(suiteAttributes.failures) > 0) {
            return suite.testcase.map((testcase) =>
              (function(testcase) {
                if (testcase.failure) {
                  let testcaseAttributes = testcase.$;
                  return testcase.failure.map((failure) =>
                    (failure =>
                      fails.push({
                        name: testcaseAttributes.name,
                        classname: testcaseAttributes.classname,
                        cause: failure._
                      })
                    )(failure));
                }
              })(testcase));
          }
        })(suite);
      }

      // console.log('fails=', fails)
      if (fails.length) {
        throw new ProjectTestError(fails);
      }
      cb();
    }
    );
  });
}

for (const ts of settings) {
  if (!ts.full) {
    continue;
  }
  describe(`webpack-versatile generator ${ts.toString()}`, function() {
    let app;
    this.timeout(5 * 60 * 1000);
    let serverResultsFile = null;
    let clientResultsFile = null;
    let testDir = path.join(__dirname, 'project');
    let resultsDir = path.join(testDir, '.tmp', 'test-results');
    before(function(done) {
      testDirectoryFaster(testDir, () => {
        app = helpers.createGenerator(
          'webpack-versatile:app',
          [ '../../generators/app' ],
          []
        );
        done();
      });
    });
    it('runs the project tests', function(done) {
      helpers.mockPrompt(app, ts.getAnswers());
      app.run(function() {
        runAppTest(done);
      });
    });
    it('run tests without server failures', function(done) {
      serverResultsFile = path.join(resultsDir, 'server.xml');
      assert.file(serverResultsFile);
      return checkResults(serverResultsFile, done);
    });
    const browserNames = ['PhantomJS'];
    for (const browserName of browserNames) {
      it(`run tests without client failures for '${browserName}'` , done =>
        glob(path.join(resultsDir, browserName + '*', 'client.xml'), function(err, clientResultsFiles) {
          // gutil.log(`clientResultsFiles=${clientResultsFiles}`);
          assert(err === null, 'cannot read "client.xml"');
          assert(clientResultsFiles.length === 1, 'missing or multiple "client.xml"');
          clientResultsFile = clientResultsFiles[0];
          assert.file(clientResultsFile);
          return checkResults(clientResultsFile, done);
        })
      );
    }
  });
}
