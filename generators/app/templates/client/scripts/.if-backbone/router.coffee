'use strict'

### global define ###

define [
  'backbone'
  './views/simple'
], (Backbone, SimpleView) ->
  AppRouter = Backbone.Router.extend(
    routes:
      '': 'showHome'
      'about': 'showAbout'
      '*actions': 'defaultAction'
    targetEl: '#body-container'
    initialize: (options) ->
      console.log 'AppRouter.initialize'
      @app = options.app
      @homeView = new SimpleView(
        el: @targetEl
        templateName: 'home'
        app: @app)
      @aboutView = new SimpleView(
        el: @targetEl
        templateName: 'about'
        app: @app)
      Backbone.history.start()
      return
    showHome: ->
      @homeView.render()
      return
    showAbout: ->
      @aboutView.render()
      return
    defaultAction: ->
      console.log 'defaultAction'
      @showHome()
      return
  )
  AppRouter
