'use strict'

Marionette = require 'backbone.marionette'
SimpleView = require './views/simple'

Controller = Marionette.Object.extend

  targetEl: '#body-container'

  initialize: (options) ->
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


module.exports = Controller

