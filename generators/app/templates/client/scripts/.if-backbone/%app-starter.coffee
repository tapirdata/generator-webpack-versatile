'use strict'

<% if (use.bootstrap || use.foundation) { %>### global window ###<% } %>

$ = require 'jquery'
Backbone = require 'backbone'
Backbone.$ = $<% if (use.bootstrap) { %>
window.jQuery = $ # bootstrap needs this
require 'bootstrap-sass'<% } %><% if (use.foundation) { %>
window.jQuery = $ # foundation needs this
require 'foundation'<% } %>

Router = require './router'

app =
  initialize: ->
    console.log 'app.initialize'
    new Router app: @
    return
  title: '<%= appnameCap %>'

module.exports = ->
  app.initialize()
  app
