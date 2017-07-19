import path = require("path")
import fs = require("fs")
import child_process = require("child_process")
import _ = require("lodash")
import rimraf = require("rimraf")
import xml2js = require("xml2js")
import glob = require("glob")
import helpers = require("yeoman-test")
import Generator = require("yeoman-generator")
// tslint:disable-next-line:no-var-requires
const assert = require("yeoman-assert")

import settings from "./settings"

interface Fail {
  classname: string
  name: string
  cause: string
}

type Done = (err?: Error) => void

class ProjectTestError extends Error {

  public fails: any

  constructor(fails: Fail[]) {
    super()
    this.fails = fails
  }

  public get name() {
    return "ProjectTestError"
  }

  public get message() {
    const lines = _(this.fails)
      .map((fail: Fail) =>
        [
          `class: ${fail.classname}`,
          `name:  ${fail.name}`,
          `cause: ${fail.cause}`,
        ])
      .flatten()
      .value()
    return `ProjectTestError\n${lines.join("\n")}`
  }
}

function backupRepos(testDir: string, bakDir: string, cb: Done) {
  return rimraf(bakDir, () =>
    fs.mkdir(bakDir, () =>
      fs.rename(path.join(testDir, "bower_components"), path.join(bakDir, "bower_components"), () =>
        fs.rename(path.join(testDir, "node_modules"), path.join(bakDir, "node_modules"), () => cb(),
        ),
      ),
    ),
  )
}

function restoreRepos(testDir: string, bakDir: string, cb: Done) {
  return fs.rename(path.join(bakDir, "bower_components"), path.join(testDir, "bower_components"), () =>
    fs.rename(path.join(bakDir, "node_modules"), path.join(testDir, "node_modules"), () => cb(),
    ),
  )
}

function testDirectoryFaster(testDir: string, cb: Done) {
  const bakDir = testDir + ".bak"
  return backupRepos(testDir, bakDir, () =>
    helpers.testDirectory(testDir, (err) => {
      if (err) {
        cb(err)
        return
      }
      restoreRepos(testDir, bakDir, cb)
    }),
  )
}

function runAppTest(cb: Done) {
  const appTest = child_process.spawn("./node_modules/.bin/gulp", ["--env", "test", "test-ci"])

  appTest.stdout.on("data", (data) => process.stdout.write(data),
  )

  appTest.stderr.on("data", (data) => {
    process.stderr.write("ERROR: ")
    return process.stderr.write(data)
  })

  return appTest.on("close", (code) => {
    assert(code === 0, `gulp test returns with code ${code}`)
    return cb()
  })
}

function checkResults(file: string, cb: Done) {
  fs.readFile(file, (readErr, xml) => {
    if (readErr) {
      cb(readErr)
      return
    }
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        cb(err)
        return
      }
      let suites
      if (result.testsuites) {
        suites = result.testsuites.testsuite
      } else {
        suites = [result.testsuite]
      }
      assert.ok(suites && suites.length > 0, "no testsuite found")
      const fails: Fail[] = []
      for (const suite of suites) {
        const suiteAttributes = suite.$
        if (Number(suiteAttributes.failures) > 0) {
          return suite.testcase.map((testcase: any) => {
            if (testcase.failure) {
              const testcaseAttributes = testcase.$
              return testcase.failure.map((failure: any) => {
                fails.push({
                  name: testcaseAttributes.name,
                  classname: testcaseAttributes.classname,
                  cause: failure._,
                })
              })
            }
          })
        }
      }

      // console.log('fails=', fails)
      if (fails.length) {
        throw new ProjectTestError(fails)
      }
      cb()
    })
  })
}

// tslint:disable:only-arrow-functions
for (const ts of settings) {
  if (!ts.full) {
    continue
  }
  describe(`webpack-versatile generator ${ts.toString()}`, function() {
    let app: Generator
    this.timeout(5 * 60 * 1000)
    let serverResultsFile: string
    let clientResultsFile: string
    const testDir = path.join(__dirname, "project")
    const resultsDir = path.join(testDir, ".tmp", "test-results")
    before(function(done) {
      testDirectoryFaster(testDir, () => {
        app = helpers.createGenerator(
          "webpack-versatile:app",
          [ "../../generators/app" ],
          [],
        )
        done()
      })
    })
    it("runs the project tests", function(done) {
      helpers.mockPrompt(app, ts.getAnswers())
      app.run(function() {
        runAppTest(done)
      })
    })
    it("run tests without server failures", function(done) {
      serverResultsFile = path.join(resultsDir, "server.xml")
      assert.file(serverResultsFile)
      return checkResults(serverResultsFile, done)
    })
    const browserNames = ["PhantomJS"]
    for (const browserName of browserNames) {
      it(`run tests without client failures for '${browserName}'` , (done) =>
        glob(path.join(resultsDir, browserName + "*", "client.xml"), function(err, clientResultsFiles) {
          assert(err === null, 'cannot read "client.xml"')
          assert(clientResultsFiles.length === 1, 'missing or multiple "client.xml"')
          clientResultsFile = clientResultsFiles[0]
          assert.file(clientResultsFile)
          return checkResults(clientResultsFile, done)
        }),
      )
    }
  })
}
