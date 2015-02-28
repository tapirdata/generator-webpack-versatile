###global describe, beforeEach, it###

'use strict'
assert = require('assert')
describe 'browserify-versatile generator', ->
  it 'can be imported without blowing up', ->
    app = require('../generators/app')
    assert app != undefined
    return
  return
