'use strict'

### global define, describe, before, it ###

define [
  'jquery'
  'when'
  'chai'
  'app/scripts/templates'
], ($, w, chai, templates) ->
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
      expect(p).to.eventually.be.equal 24
    it 'templates should have "about"', ->
      expect(templates).to.have.property 'about'
      return
    return
  return
