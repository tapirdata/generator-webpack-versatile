'use strict'

<% if (use.foundation) { %>### global document ###<% } %>
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
    Backbone.history.start()
    return
  showHome: ->
    @homeView.render()<% if (use.foundation) { %>
    $(document).foundation()<% } %>
    return
  showAbout: ->
    @aboutView.render()<% if (use.foundation) { %>
    $(document).foundation()<% } %>
    return
  showContact: ->
    @contactView.render()<% if (use.foundation) { %>
    $(document).foundation()<% } %>
    return
  defaultAction: ->
    console.log 'defaultAction'
    @showHome()
    return

