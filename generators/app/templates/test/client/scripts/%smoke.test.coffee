'use strict'

### global describe, before, it ###

$          = require 'jquery'
w          = require 'when'
chai       = require 'chai'
appStarter = require '../../../src/client/scripts/app-starter'

expect = chai.expect

gasper = do ->
  Gasper = require './gasper'
  options =<% if (use.backbone) { %>
    switchFast: true<% } %>
    headFilter: ($child) ->
      if not $child.is 'script'
        return true
  new Gasper options

describe 'The Application', ->
  @timeout 10000
  $testMain = undefined
  before ->
    gasper.show '/'
    .then -> appStarter()
  it 'should show the home page', ->
    expect($ 'div.jumbotron').to.have.length 1
    expect($ 'ul.nav li:nth-child(1)').$class 'active'
  it 'should show the about page', ->
    w()
    .delay 200
    .then ->
      console.log 'click about'
      gasper.activate $ 'ul.nav li:nth-child(2) a'
    .then -> gasper.retry ->
      0 and expect($ 'div.jumbotron').to.have.length 0
  it 'should show something', ->
    w().delay 800

