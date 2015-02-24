'use strict'

$ = require 'jquery'
Backbone = require 'backbone'
SimpleView = require './views/simple'

module.exports = Backbone.Router.extend
  routes:
    '': 'showHome'
    'about': 'showAbout'
    'contact': 'showContact'
    '*actions': 'defaultAction'
  targetEl: '#body-container'
  initialize: (options) ->
    console.log 'AppRouter.initialize'
    @app = options.app
    @homeView = new SimpleView(
      el: @targetEl
      template: require '../templates/home.jade'
      app: @app)
    @aboutView = new SimpleView(
      el: @targetEl
      template: require '../templates/about.jade'
      app: @app)
    @contactView = new SimpleView(
      el: @targetEl
      template: require '../templates/contact.jade'
      app: @app)
    Backbone.history.start()
    return
  showHome: ->
    @homeView.render()
    return
  showAbout: ->
    @aboutView.render()
    return
  showContact: ->
    @contactView.render()
    return
  defaultAction: ->
    console.log 'defaultAction'
    @showHome()
    return

