'use strict'

### global describe, it ###

chai = require 'chai'
aboutTemplate = require '../../../src/client/templates/about.jade'

expect = chai.expect

describe 'Template Tests', ->
  it 'template "about" should be a function', ->
    expect(aboutTemplate).to.be.a 'function'
    return
  return
