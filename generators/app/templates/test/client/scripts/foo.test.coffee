'use strict'

### global describe, before, it ###

$ = require 'jquery'
w = require 'when'
chai = require 'chai'

require './gasper'

expect = chai.expect

describe 'The Foo Tests', ->
  $testMain = undefined
  before ->
    $testMain = $('<div class="test-main" />').appendTo('body')
    return
  it 'should equal', ->
    expect(3 * 2).equal 6
    return
  it 'jquery should have Deferred', ->
    expect($.Deferred).is.a 'function'
    return
  it 'promise should resolve', ->
    p = w(6 * 4)
    expect(p).to.eventually.be.equal 24, 'promised multiplication'
  return
return
