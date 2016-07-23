'use strict'

<% if (use.bootstrap || use.foundation) { -%>
### global window ###
<% } -%>
<% if (use.foundation) { -%>
### global document ###
<% } -%>

$ = require 'jquery'
w = require 'when'
<% if (use.backbone) { -%>
Backbone = require 'backbone'
<% } -%>
<% if (use.marionette) { -%>
Marionette = require 'backbone.marionette'
<% } -%>

<% if (use.bootstrap) { -%>
window.jQuery = $ # bootstrap needs this
require 'bootstrap-sass'
<% } -%>

<% if (use.marionette) { -%>
App = Marionette.Application.extend
<% } else { -%>
class App
<% } -%>

  title: '<%= appnameCap %>'

  initialize: ->
<% if (use.marionette) { -%>
    @on 'start', ->
      @_createRouter()
      Backbone.history.start()
      return
<% } -%>

  _createRouter: ->
    Controller = require './controller'
    Router = require './router'
    new Router
      controller: new Controller
        app: @
    return

  launch: ->
    # console.log 'app.launch'
    @amendPage()
      .then =>
        @start()

<% if (!use.marionette) { -%>
  start: ->
<% if (use.backbone) { -%>
    @_createRouter()
    Backbone.history.start()
    return
<% } else { -%>
    @instrumentPage()
<% } -%>
<% } -%>

  amendPage: ->
    # things to be done on first page load
<% if (use.foundation) { -%>
    window.jQuery = $ # foundation needs this
    (
      w $.ajax # load script async
        url: '/vendor/foundation/foundation.js'
        dataType: 'script'
    )
      .then ->
        # console.log 'foundation loaded'
<% } else { -%>
    w()
<% } -%>

  instrumentPage: ->
    # things to be done after page contents has been modified
    w()
<% if (use.foundation) { -%>
      .then ->
        # console.log 'run foundation()'
        $(document).foundation()
        return
<% } -%>


module.exports = ->
  app = new App()
  app.launch()
    .then ->
      app
