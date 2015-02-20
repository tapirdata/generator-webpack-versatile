'use strict'

### global define, describe, before, it ###


define [
  'jquery'
  'when'
  'chai'
  'app/scripts/app-starter'
  './smoke-helper'
  'css!app/styles/main.css'
  ], ($, w, chai, appStarter, sm) ->

  expect = chai.expect
  describe 'The Application', ->
    @timeout 10000
    $testMain = undefined
    before ->
      $testMain = $('<div id="body-container" class="container" />')
      .appendTo('body')
      appStarter()
      return
    it 'should show the home page', ->
      expect($ 'div.jumbotron').to.have.length 1
    it 'should show the about page', ->
      w()
      .delay 200
      .then ->
        console.log 'click about'
        sm.activateLink sm.$at $('ul.nav li a'), 1
      .then -> sm.retry ->
        expect($ 'div.jumbotron').to.have.length 0
    it 'should show something', ->
      w().delay(800)
  return

