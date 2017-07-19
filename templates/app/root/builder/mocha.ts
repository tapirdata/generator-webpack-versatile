import path = require("path")
import gulp = require("gulp")

export class Mocha {

  public isActive: boolean
  private builder: any

  constructor(builder: any) {
    this.builder = builder
  }

  public start() {
    const builder = this.builder
    this.isActive = true
    const reporter = builder.headlessEnabled ?
      (process.env.JUNIT_REPORT_PATH = path.join(builder.dirs.tmp, "test-results", "server.xml"),
      "mocha-jenkins-reporter")
    :
      "spec"
    return (
      gulp.src(builder.globPatterns.TEST, {
        cwd: `${builder.dirs.tgt.server}/test/scripts`,
        read: false,
      })
    )
      .pipe(builder.plumber())
      .pipe(this.builder.plugins.mocha({ reporter }))
  }

  public rerun() {
    if (this.isActive) {
      return this.start()
    }
  }

  public rerunIfWatch() {
    return this.builder.plugins.tap(() => {
      if (this.builder.watchEnabled) {
        return this.rerun()
      }
    })
  }

}
