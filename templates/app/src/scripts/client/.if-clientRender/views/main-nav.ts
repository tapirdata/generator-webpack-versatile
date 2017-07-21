import $ = require("jquery")

import BaseView from "./base"

import menuToggler = require("../../../templates/_menu-toggler.pug")

export default class MainNavView extends BaseView {

  public render() {
    this.$el.html(this.template(this.params))

    const $menuToggler = $("div.menu-toggler")
    $menuToggler.replaceWith((menuToggler as any)(this.params))
    return this
  }

}
