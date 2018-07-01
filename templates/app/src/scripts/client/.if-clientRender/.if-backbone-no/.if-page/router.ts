import page = require("page")

import Controller from "./controller"

export default class Router {

  private controller!: Controller

  constructor(options: any = {}) {
    this.initialize(options)
  }

  public initialize(options: any) {
    this.controller = options.controller
    page("/section/:section/", (ctx: any, next: any) => {
      this.showSection(ctx.params.section)
    })
    page("*", () => {
      this.defaultAction()
    })
  }

  public showSection(section: string) {
    this.controller.showSection(section)
  }

  public defaultAction() {
    this.controller.defaultAction()
  }

}
