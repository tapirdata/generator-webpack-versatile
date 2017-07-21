<% if (use.backbone) { -%>
import Backbone = require("backbone")
<% } else { -%>
import $ = require("jquery")
<% } -%>
<% if (use.marionette) { -%>
import Marionette = require("backbone.marionette")
<% } -%>

import { allSections, sectionTitles } from "../../common/constants"
<% if (use.backbone) { -%>

// tslint:disable:max-classes-per-file
class EmptyModel extends Backbone.Model {}
<% } -%>

<% if (use.marionette) { -%>
class BaseView extends Marionette.View<EmptyModel> {
<% } else if (use.backbone) { -%>
class BaseView extends Backbone.View<EmptyModel> {
<% } else { -%>
class BaseView {
<% } -%>

  public app: any
  public template: any
  public section: any
  public params: any
<% if (!use.backbone) { -%>
  public $el: any
<% } -%>

  constructor(options?: any) {
<% if (use.backbone) { -%>
    super(options)
<% } else { -%>
    this.initialize(options)
<% } -%>
  }

  public initialize(options: any) {
    this.app = options.app
    this.template = options.template
    this.section = options.section
<% if (!use.backbone) { -%>
    this.$el = $(options.el)
<% } -%>

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

export default BaseView
