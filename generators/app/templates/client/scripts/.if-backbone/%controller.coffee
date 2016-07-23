'use strict'

SimpleView = require './views/simple'

<% if (use.marionette) { -%>
Marionette = require 'backbone.marionette'
Controller = Marionette.Object.extend
<% } else { -%>
class Controller
  constructor: (options) ->
    @initialize options
    return
<% } -%>

  targetEl: '#body-container'

  initialize: (options) ->
    @app = options.app
    @currentView = null
    return

  _showView: (view) ->
    view.render()
    @app.instrumentPage()
    @currentView = view
    return

  _showTemplate: (template) ->
    @_showView new SimpleView
      el: @targetEl
      template: template
      app: @app
    return

  showHome: ->
    @_showTemplate require '../templates/home.jade'
    return

  showAbout: ->
    @_showTemplate require '../templates/about.jade'
    return

  showContact: ->
    @_showTemplate require '../templates/contact.jade'
    return

  defaultAction: ->
    @showHome()
    return


module.exports = Controller

