###global describe, beforeEach, it###

'use strict'
assert = require('assert')
describe 'browserify-versatile generator', ->
  it 'can be imported without blowing up', ->
    @timeout 5000
    app = require('../generators/app')
    assert app != undefined
    return
  return
