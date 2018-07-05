import path = require("path")
import yosay = require("yosay")
import ejs = require("ejs")

import BaseGenerator from "../../lib/base"
import Makeup from "./makeup"

export default class AppGenerator extends BaseGenerator {

  protected makeup!: Makeup

  constructor(args: string|string[], options: {}) {
    super(args, options)
    this.sourceRoot(path.join(__dirname, "../../../templates/app"))
    this._setupMakeup()
  }

  private _setupMakeup() {
    const makeup = new Makeup(this)
    makeup.applyConfig(this.config.getAll())
    makeup.applyOptions(this.options)
    makeup.applyDefaults(this.appname)
    this.makeup = makeup
  }

  public prompting() {
    if (!(this.options as any)["skip-welcome-message"]) {
      // Have Yeoman greet the user.
      this.log(yosay("Welcome to the marvelous WebpackVersatile generator!"))
    }

    const questions = this.makeup.getQuestions()
    return this.prompt(questions)
      .then((answers) => {
        this.makeup.putAnswers(answers)
      })
  }

  public configuring() {
    this.config.set(this.makeup.getPermanetConfig(), undefined)
    this.config.save()
  }

  public writing() {
    const templateConfig = this.makeup.getTemplateConfig()
    const dirs = templateConfig.dirs

    const templateTransformer = {
      src: /^%(.*)/,
      tgt: "$1",
      fn: (s: string) => {
        return ejs.render(s, templateConfig)
      },
    }

    // this.log('copy project files');
    this._branchCopy({
      source: "root",
      branches: templateConfig.use,
      transformers: [templateTransformer],
    })

    // this.log('copy src files');
    this._branchCopy({
      source: "src",
      target: dirs.src,
      branches: templateConfig.use,
      transformers: [templateTransformer],
    })

    // this.log('copy test files');
    this._branchCopy({
      source: "test",
      target: dirs.test,
      branches: templateConfig.use,
      transformers: [templateTransformer],
    })
  }

  public install() {
    if (!(this.options as any)["skip-install"]) {
      this.installDependencies()
    }
  }
}
