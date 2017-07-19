import assert = require("assert")

// tslint:disable:only-arrow-functions
describe("webpack-versatile generator", function() {
  it("can be imported without blowing up", function() {
    this.timeout(5000)
    const app = require("../generators/app")
    assert(app !== undefined)
  })
})
