import $ = require("jquery")

import BaseView from "./base"

import footer = require("../../../templates/_footer.pug")

export default class PageView extends BaseView {

  public render() {
    this.$el.html(this.template(this.params))

    const $footer = $("#footer")
    $footer.replaceWith((footer as any)(this.params))
    return this
  }
}
