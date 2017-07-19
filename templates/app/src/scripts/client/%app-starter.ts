import "babel-polyfill"
<% if (use.bootstrap || use.foundation || use.backbone) { -%>
// global window */
import $ = require("jquery")
<% } -%>
<% if (use.foundation) { -%>
// global document */
<% } -%>
<% if (use.backbone) { -%>

import Backbone = require("backbone")
<% } -%>
<% if (use.marionette) { -%>
import Marionette = require("backbone.marionette")
<% } -%>

import defaultOptions = require("../config/default.json")
<% if (use.backbone) { -%>
import Controller from "./controller"
<% } -%>
import { wrapDeferred } from "./helpers"
<% if (use.backbone) { -%>
import Router from "./router"
<% } -%>
<% if (use.bootstrap || use.foundation) { -%>

(window as any).jQuery = $ // bootstrap needs this, foundation 6.2.3 needs this
<% } -%>
<% if (use.bootstrap) { -%>
    //
// tslint:disable-next-line:no-var-requires
require("bootstrap-sass")
<% } -%>

<% if (use.marionette) { -%>
class App extends Marionette.Application {

  public router: Router

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

  public options: any
<% if (use.backbone) { -%>
  public router: Router
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
    // $.fn.load = function(fn) {  // foundation 6.2.3 still uses deprecated '$.fn.load'
    //   return this.on('load', fn);
    // };

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
<% if (use.backbone) { -%>

  private _createRouter() {
    this.router = new Router({
      controller: new Controller({
        app: this,
      }),
    })
  }

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
<% if (!use.marionette) { -%>

  private async start() {
<% if (use.backbone) { -%>
    this._createRouter()
    Backbone.history.start({
      pushState: true,
      root: "/",
    })
    this._catchAnchors()
<% } else { -%>
    return this.instrumentPage()
<% } -%>
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
