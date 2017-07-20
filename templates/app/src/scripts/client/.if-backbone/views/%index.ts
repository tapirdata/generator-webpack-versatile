// tslint:disable:max-classes-per-file

import $ = require("jquery")
import Backbone = require("backbone")
<% if (use.marionette) { -%>
import Marionette = require("backbone.marionette")
<% } -%>

import footer = require("../../../templates/_footer.pug")
import menuToggler = require("../../../templates/_menu-toggler.pug")
import { allSections, sectionTitles } from "../../common/constants"

class EmptyModel extends Backbone.Model {
}

<% if (use.marionette) { -%>
class BaseView extends Marionette.View<EmptyModel> {
<% } else { -%>
class BaseView extends Backbone.View<EmptyModel> {
<% } -%>

  public app: any
  public template: any
  public section: any
  public params: any

  constructor(...args: any[]) {
    super(...args)
  }

  public initialize(options: any) {
    this.app = options.app
    this.template = options.template
    this.section = options.section

    this.params = {
      constants: {
        title: this.app.options.title,
        allSections,
        sectionTitles,
      },
      section: this.section,
      parts: {},
      linkingMode: "client",
    }
  }
}

class PageView extends BaseView {

  public render() {
    this.$el.html(this.template(this.params))

    const $footer = $("#footer")
    $footer.replaceWith((footer as any)(this.params))
    return this
  }
}

class MainNavView extends BaseView {

  public render() {
    this.$el.html(this.template(this.params))

    const $menuToggler = $("div.menu-toggler")
    $menuToggler.replaceWith((menuToggler as any)(this.params))
    return this
  }

}

export { PageView, MainNavView }
