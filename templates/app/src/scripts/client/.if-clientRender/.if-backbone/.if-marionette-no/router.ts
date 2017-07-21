import Backbone = require("backbone")

class Router extends Backbone.Router {

  private controller: any
  private targetEl: string

  constructor(options?: any) {
    super(options)
  }

  public initialize(options: any) {
    this.controller = options.controller
    this.targetEl = "#body-container"
  }

  public get routes() {
    return {
      "section/:section/": "showSection",
      "*actions": "defaultAction",
    }
  }

  public showSection(section: string) {
    this.controller.showSection(section)
  }

  public defaultAction() {
    this.controller.defaultAction()
  }
}

export default Router
