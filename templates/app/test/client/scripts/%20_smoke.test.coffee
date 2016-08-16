'use strict'

### global describe, before, it ###

$          = require 'jquery'
chai       = require 'chai'
appStarter = require '../../../src/client/scripts/app-starter'

expect = chai.expect

gasper = do ->
  Gasper = require './gasper'
  options =
    headFilter: ($child) ->
      if not $child.is 'script'
        return true
  new Gasper options

describe 'The Application', ->
  @timeout 10000
  before ->
    gasper.show '/'
    .then -> appStarter()
    .then (app) ->
      gasper.app = app
      return
  it 'should show the home page', ->
    expect($ 'div.jumbotron').to.have.length 1
    expect($('#main-nav li.item').eq(0)).$class 'active'
  it 'home page should show the yeoman image', ->
    Promise.resolve().then -> gasper.retry ->
      $imgs = $ 'img[alt="the yeoman"]'
      expect($imgs).to.have.length 1
      img = $imgs[0]
      expect(img.naturalWidth).above 10
      expect(img.naturalHeight).above 10
<% if (use.foundation) { -%>
  it 'home page should have the stylesheet applied', ->
    Promise.resolve().then -> gasper.retry ->
      $btn = $ '.button.success'
      expect($btn).to.have.$css 'background-color', 'rgb(58, 219, 118)'
<% } -%>
<% if (use.bootstrap) { -%>
  it 'home page should have the stylesheet applied', ->
    Promise.resolve().then -> gasper.retry ->
      $btn = $ '.btn-success'
      expect($btn).to.have.$css 'background-color', 'rgb(92, 184, 92)'
<% } -%>
  it 'should show the about page', ->
    Promise.resolve()
    .then gasper.delay 200
    .then ->
      # console.log 'click about'
      gasper.activate $('#main-nav li.item a').eq(1)
    .then -> gasper.retry ->
      expect($ 'div.jumbotron').to.have.length 0
      expect($('p').text()).to.contain 'about'

  it 'should show the contact page', ->
    Promise.resolve()
    .then gasper.delay 200
    .then ->
      # console.log 'click contact'
      gasper.activate $('#main-nav li.item a').eq(2)
    .then -> gasper.retry ->
      expect($ 'div.jumbotron').to.have.length 0
      expect($('p').text()).to.contain 'contact'
  it 'should show the home page again', ->
    Promise.resolve()
    .then gasper.delay 200
    .then ->
      # console.log 'click home'
      gasper.activate $('#main-nav li.item a').eq(0)
    .then -> gasper.retry ->
      expect($ 'div.jumbotron').to.have.length 1

