import path = require( "path")
import helpers = require("yeoman-test")
import Generator = require("yeoman-generator")
// tslint:disable-next-line:no-var-requires
const assert = require("yeoman-assert")

import settings from "./settings"

for (const ts of settings) {
  const answers = ts.getAnswers()
  const STYLE_EXT = answers.features.indexOf("sass") >= 0 ? ".sass" : ".css"
  describe(`webpack-versatile generator ${ts.toString()}`, () => {
    let app: Generator
    before((done) => {
      helpers.testDirectory(path.join(__dirname, "temp"), (err) => {
        if (err) {
          done(err)
          return
        }
        app = helpers.createGenerator(
          "webpack-versatile:app",
          [ "../../generators/app" ],
          [],
          {"test-framework": "none"},
        )
        helpers.mockPrompt(app, answers)
        done()
      },
      )
    })
    if (ts.unsupported) {
      it("expected to be unsupported", (done) =>
        // TODO: assert error
        done(),
      )
    } else {
      it("creates expected files", (done) => {
        let expected = [
          ".bowerrc",
          "bower.json",
          ".editorconfig",
          ".gitignore",
          "gulpfile.js",
          "gulpmain.ts",
          "tsconfig.json",
          "tslint.json",
          "package.json",
          "README.md",
          "config/default.json",
          "config/development.json",
          "config/production.json",
          "config/testing.json",
          "src/scripts/server/routes/main.ts",
          "src/scripts/server/app.ts",
          "src/scripts/server/setup.ts",
          "src/scripts/server/start.ts",
          "src/templates/layout.pug",
          "src/templates/index.pug",
          "src/templates/sections/home.pug",
          "src/templates/sections/about.pug",
          "src/templates/sections/contact.pug",
          "src/images/favicon.ico",
          "src/pages/robots.txt",
          "src/pages/404.html",
          "src/scripts/client/main.ts",
          "src/scripts/client/app-starter.ts",
          `src/styles/main${STYLE_EXT}`,
        ]
        if (["page", "backbone", "marionette"].includes(answers.framework)) {
          expected = expected.concat([
            "src/scripts/client/router.ts",
            "src/scripts/client/views/base.ts",
            "src/scripts/client/views/main-nav.ts",
            "src/scripts/client/views/page.ts",
          ])
        }
        // console.log(expected)
        (app.options as any)["skip-install"] = true
        return app.run(() => {
          assert.file(expected)
          done()
        })
      })
    }
  })
}
