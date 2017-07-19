import $ = require("jquery")
import chai = require("chai")
const { expect } = chai

import appStarter from "../../../src/scripts/client/app-starter"
import Gasper from "./gasper"

const gasper = new Gasper({
  headFilter($child: JQuery<HTMLElement>) {
    return !$child.is("script")
  },
})

describe("The Application", function() {
  this.timeout(10000)
  before(async () => {
    await gasper.show("/")
    const app = await appStarter()
    gasper.app = app
  })
  it("should show the home page", () => {
    expect($("div.jumbotron")).to.have.length(1)
    expect($("#main-nav li.item").eq(0).hasClass("active")).to.be.true // tslint:disable-line:no-unused-expression
  })
  it("home page should show the yeoman image", async () => {
    await gasper.retry(() => {
      const $imgs = $('img[alt="the yeoman"]')
      expect($imgs).to.have.length(1)
      const img: any = $imgs[0]
      expect(img.naturalWidth).above(10)
      expect(img.naturalHeight).above(10)
    })
  })
<% if (use.foundation) { -%>
  it("home page should have the stylesheet applied", async () => {
    gasper.retry(() => {
      const $btn = $(".button.success")
      expect($btn.css("background-color")).to.be.equal("rgb(58, 219, 118)")
    })
  })
<% } -%>
<% if (use.bootstrap) { -%>
  it("home page should have the stylesheet applied", async () => {
    gasper.retry(() => {
      const $btn = $(".btn-success")
      expect($btn.css("background-color")).to.be.equal("rgb(92, 184, 92)")
    })
  })
<% } -%>
  it("should show the about page", async () => {
    await gasper.delay(200)
    await gasper.activate($("#main-nav li.item a").eq(1))
    await gasper.retry(() => {
      expect($("div.jumbotron")).to.have.length(0)
      expect($("h1").text()).to.contain("About")
    })
  })
  it("should show the contact page", async () => {
    await gasper.delay(200)
    await gasper.activate($("#main-nav li.item a").eq(2))
    await gasper.retry(() => {
      expect($("div.jumbotron")).to.have.length(0)
      expect($("h1").text()).to.contain("Contact")
    })
  })
  it("should show the home page again", async () => {
    await gasper.delay(200)
    await gasper.activate($("#main-nav li.item a").eq(0))
    await gasper.retry(() => {
      expect($("div.jumbotron")).to.have.length(1)
    })
  })
})
