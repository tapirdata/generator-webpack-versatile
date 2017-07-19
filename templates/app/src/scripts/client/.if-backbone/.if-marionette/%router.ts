import Marionette = require("backbone.marionette")

class Router extends Marionette.AppRouter {

  public appRoutes: any

  constructor(options?: any) {
    super(options)
  }

  public initialize() {
    this.appRoutes = {
      "section/:section/": "showSection",
      "*actions": "defaultAction",
    }
  }
}

export default Router
