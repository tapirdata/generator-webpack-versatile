/* global describe, it */

import chai = require("chai")
const { expect } = chai

// tslint:disable-next-line:no-var-requires
const aboutTemplate = require("../../../src/templates/sections/about.pug")

describe("Template Tests", () => {
  it('template "about" should be a function', () => {
    expect(aboutTemplate).to.be.a("function")
  })
  it('template "about" should render correctly', () => {
    const snippet = aboutTemplate({aboutText: "TITLE"})
    expect(snippet).to.contain("TITLE")
  })
})
