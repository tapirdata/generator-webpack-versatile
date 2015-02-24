'use strict'

### global window ###

$ = require 'jquery'<% if (use.backbone) { %>
Backbone = require 'backbone'
Backbone.$ = $<% } %><% if (use.bootstrap) { %>
window.jQuery = $ # bootstrap needs this
require 'bootstrap-sass'<% } %>

Router = require './router'

app =
  initialize: ->
    console.log 'app.initialize'
    new Router(app: this)
    return
  title: '<%= _.capitalize(appname) %>'

module.exports = ->
  app.initialize()
  app
