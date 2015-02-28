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
  before ->
    gasper.show '/'
    .then -> appStarter()
  it 'should show the home page', ->
    expect($ 'div.jumbotron').to.have.length 1
    expect($ 'ul.nav li:nth-child(1)').$class 'active'
  it 'should show the about page', ->
    w()
    # .delay 200 # slow motion
    .then ->
      # console.log 'click about'
      gasper.activate $ 'ul.nav li:nth-child(2) a'
    .then -> gasper.retry ->
      expect($ 'div.jumbotron').to.have.length 0
      expect($('p').text()).to.contain 'about'
  it 'should show the contact page', ->
    w()
    # .delay 200 # slow motion
    .then ->
      # console.log 'click contact'
      gasper.activate $ 'ul.nav li:nth-child(3) a'
    .then -> gasper.retry ->
      expect($ 'div.jumbotron').to.have.length 0
      expect($('p').text()).to.contain 'contact'
  it 'should show the home page again', ->
    # w().delay 800 # slow motion
    w()
    # .delay 200 # slow motion
    .then ->
      # console.log 'click home'
      gasper.activate $ 'ul.nav li:nth-child(1) a'
    .then -> gasper.retry ->
      expect($ 'div.jumbotron').to.have.length 1

