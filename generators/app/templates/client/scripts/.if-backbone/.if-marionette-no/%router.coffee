'use strict'

$ = require 'jquery'
Backbone = require 'backbone'
SimpleView = require './views/simple'

module.exports = Backbone.Router.extend

  targetEl: '#body-container'

  routes:
    '': 'showHome'
    'about': 'showAbout'
    'contact': 'showContact'
    '*actions': 'defaultAction'

  initialize: (options) ->
    # console.log 'AppRouter.initialize'
    @app = options.app
    @homeView = new SimpleView
      el: @targetEl
      template: require '../templates/home.jade'
      app: @app
    @aboutView = new SimpleView
      el: @targetEl
      template: require '../templates/about.jade'
      app: @app
    @contactView = new SimpleView
      el: @targetEl
      template: require '../templates/contact.jade'
      app: @app
    return

  instrumentPage: ->
    @app.instrumentPage()

  showHome: ->
    @homeView.render()
    @instrumentPage()
    return

  showAbout: ->
    @aboutView.render()
    @instrumentPage()
    return

  showContact: ->
    @contactView.render()
    @instrumentPage()
    return

  defaultAction: ->
    # console.log 'defaultAction'
    @showHome()
    return
