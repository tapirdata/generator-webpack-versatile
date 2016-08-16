'use strict'

<% if (use.bootstrap || use.foundation) { -%>
### global window ###
<% } -%>
<% if (use.foundation) { -%>
### global document ###
<% } -%>

# require 'es5-shim'
require('es6-promise').polyfill()
$ = require 'jquery'
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
<% if (use.backbone) { -%>

  _createRouter: ->
    Controller = require './controller'
    Router = require './router'
    new Router
      controller: new Controller
        app: @
    return
<% } -%>

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
    window.jQuery = $    # foundation 6.2.3 needs this
    $.fn.load = (fn) ->  # foundation 6.2.3 still uses deprecated '$.fn.load'
      @on 'load', fn

    $.ajax # load script async
      url: '/vendor/foundation/foundation.js'
      dataType: 'script'
    # .then ->
    #   console.log 'foundation loaded'
<% } else { -%>
    Promise.resolve()
<% } -%>

  instrumentPage: ->
    # things to be done after page contents has been modified
    Promise.resolve()
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
