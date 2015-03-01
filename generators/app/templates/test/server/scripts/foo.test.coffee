'use strict'

### global describe, before, it ###

w = require 'when'
chai = require 'chai'
chai.use require 'chai-as-promised'
expect = chai.expect

describe 'The Server Foo Tests', ->
  before ->
  it 'should equal', ->
    expect(3 * 2).equal 6
    return
  it 'promise should resolve', ->
    p = w(6 * 4)
    expect(p).to.eventually.be.equal 24, 'promised multiplication'
  return
return
