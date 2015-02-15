'use strict'

### global define, describe, it ###

define ['chai', 'app/scripts/templates'], (chai, templates) ->
  expect = chai.expect
  describe 'Template Tests', ->
    $testMain = undefined
    it 'templates should have "about"', ->
      expect(templates).to.have.property 'about'
      return
  return
