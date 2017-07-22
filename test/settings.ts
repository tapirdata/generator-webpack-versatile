import _ = require("lodash")

import { Answers } from "../src/lib/base"

const featureNames = [
  "modernizr",
  "sass",
  "crusher",
]

const testSettings = [
  "full",
  "backbone,full",
  "sass,full",
  "sass,backbone,full",
  "modernizr,sass,backbone,full",

  "foundation,unsupported",
  "foundation,modernizr,unsupported",
  "foundation,sass,unsupported",
  "foundation,modernizr,sass,full",
  "foundation,modernizr,sass,backbone,full",
  "foundation,modernizr,sass,crusher,full",
  "foundation,modernizr,sass,page,crusher,full",
  "foundation,modernizr,sass,backbone,crusher,full",
  "foundation,modernizr,sass,backbone,marionette,crusher,full",

  "bootstrap,unsupported",
  "bootstrap,sass,full",
  "bootstrap,sass,backbone,full",
  "bootstrap,sass,crusher,full",
  "bootstrap,sass,page,crusher,full",
  "bootstrap,sass,backbone,crusher,full",
  "bootstrap,sass,backbone,marionette,crusher,full",

  "foundation,bootstrap,modernizr,sass,unsupported",
]

class TestSetting {

  public static fromString(s: string) {
    const parts = s.split(/, */)
    function hasPart(part: string) {
      return parts.indexOf(part) >= 0
    }

    const answers = {
      framework: hasPart("marionette") ? "marionette" : hasPart("backbone") ? "backbone" : hasPart("page") ? "page" : "none",
      frontend: hasPart("foundation") ? "foundation" : hasPart("bootstrap") ? "bootstrap" : "none",
      features: _(featureNames)
        .filter((name) => hasPart(name))
        .value(),
      noAdjust: true,
    }
    const opt = {
      full: hasPart("full"),
      unsupported: hasPart("unsupported"),
    }
    return new TestSetting(answers, opt)
  }

  public answers: Answers
  public unsupported: boolean
  public full: boolean

  constructor(answers: Answers, opt: any = {}) {
    this.answers = answers
    this.unsupported = opt.unsupported
    this.full = opt.full
  }

  public getAnswers() {
    return this.answers
  }

  public toString() {
    const { answers } = this
    return `(framework=${answers.framework}, frontend=${answers.frontend}, features=[${answers.features.join(",")}])`
  }

}

export default testSettings.map((s) => TestSetting.fromString(s))
