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
    @controller = options.controller
    return

  showHome: ->
    @controller.showHome()
    return

  showAbout: ->
    @controller.showAbout()
    return

  showContact: ->
    @controller.showContact()
    return

  defaultAction: ->
    @controller.defaultAction()
    return



