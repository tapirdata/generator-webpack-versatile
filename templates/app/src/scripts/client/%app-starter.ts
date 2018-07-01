import "babel-polyfill"
<% if (use.clientRender || use.foundation || use.bootstrap) { -%>
// global window */
import $ = require("jquery")
<% } -%>
<% if (use.foundation) { -%>
// global document */
<% } -%>
<% if (use.page) { -%>

import page = require("page")
<% } -%>
<% if (use.backbone) { -%>

import Backbone = require("backbone")
<% if (use.marionette) { -%>
import Marionette = require("backbone.marionette")
<% } -%>
<% } -%>

import defaultOptions = require("../common/default.json")
<% if (use.clientRender) { -%>
import Controller from "./controller"
<% } -%>
<% if (use.foundation) { -%>
import { wrapDeferred } from "./helpers"
<% } -%>
<% if (use.clientRender) { -%>
import Router from "./router"
<% } -%>
<% if (use.bootstrap) { -%>

(window as any).jQuery = $ // bootstrap needs this

// tslint:disable-next-line:no-var-requires
require("bootstrap-sass")
<% } -%>
<% if (use.foundation) { -%>

(window as any).jQuery = $ // foundation needs this
<% } -%>

<% if (use.marionette) { -%>
class App extends Marionette.Application {

  public router!: Router

  public initialize() {
    this.on("start", () => {
      this._createRouter()
      Backbone.history.start({
        pushState: true,
        root: "/",
      })
      this._catchAnchors()
    })
  }
<% } else { -%>
class App {

  public options!: any
<% if (use.clientRender) { -%>
  public router!: Router
<% } -%>

  constructor(options: any) {
    this.initialize(options)
  }

  public initialize(options: any) {
    this.options = options
  }
<% } -%>

  public async launch() {
    await this.amendPage()
    return this.start()
  }

  public async amendPage() {
    // things to be done on first page load
<% if (use.foundation) { -%>
    return wrapDeferred($.ajax({ // load script async
      url: "/__static__/vendor/foundation/foundation.js",
      dataType: "script",
    }))
<% } -%>
  }

  public async instrumentPage() {
    // things to be done after page contents has been modified
<% if (use.foundation) { -%>
    ($(document) as any).foundation()
<% } -%>
  }
<% if (use.clientRender) { -%>

  private _createRouter() {
    this.router = new Router({
      controller: new Controller({
        app: this,
      }),
    })
  }
<% if (use.backbone) { -%>

  private _catchAnchors() {
    $(document).on("click", 'a[data-linking="client"]', (event) => {
      const href = $(event.currentTarget).attr("href")
      if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        event.preventDefault()
        // Remove leading slases and hash bangs (backward compatablility)
        if (href != null) {
          const url = href.replace(/^\//, "").replace("#!/", "")
          this.router.navigate(url, { trigger: true })
        }
      }
    })
  }
<% } -%>
<% } -%>
<% if (use.marionette) { -%>
<% } else if (use.backbone) { -%>

  private async start() {
    this._createRouter()
    Backbone.history.start({
      pushState: true,
      root: "/",
    })
    this._catchAnchors()
  }
<% } else if (use.page) { -%>

  private async start() {
    this._createRouter()
    page.start()
  }
<% } else { -%>

  private async start() {
    return this.instrumentPage()
  }
<% } -%>
}

export default async function() {
  const options: any = defaultOptions
  const app = new App({
    title: options.app.title,
  })
  await app.launch()
  return app
}
