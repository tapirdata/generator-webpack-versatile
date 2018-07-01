<% if (use.marionette) { -%>
import Marionette = require("backbone.marionette")
<% } -%>

import mainNavTemplate = require("../../templates/_main-nav.pug")
import MainNavView from "./views/main-nav"
import PageView from "./views/page"

<% if (use.marionette) { -%>
class Controller extends Marionette.Object {
<% } else { -%>
class Controller {
<% } -%>

  public pageTargetEl!: string
  public mainNavTargetEl!: string
  public app!: any
  public currentView!: any

<% if (use.marionette) { -%>
  constructor(...args: any[]) {
    super(...args)
  }
<% } else { -%>
  constructor(options: any) {
    this.initialize(options)
  }
<% } -%>

  public initialize(options: any) {
    this.pageTargetEl = "#page-meat"
    this.mainNavTargetEl = "#main-nav"
    this.app = options.app
    this.currentView = null
  }

  public showSection(section: string) {
    const pageTemplate = require(`../../templates/sections/${section}.pug`)
    const pageView = new PageView({
      el: this.pageTargetEl,
      app: this.app,
      template: pageTemplate,
      section,
    })
    const mainNavView = new MainNavView({
      el: this.mainNavTargetEl,
      app: this.app,
      template: mainNavTemplate,
      section,
    })
    return this._showView(pageView, mainNavView)
  }

  public defaultAction() {
    return this.showSection("home")
  }

  private async _showView(pageView: any, mainNavView: any) {
    mainNavView.render()
    pageView.render()
    await this.app.instrumentPage()
    this.currentView = pageView
    window.scrollTo(0, 0)
  }

}

export default Controller
