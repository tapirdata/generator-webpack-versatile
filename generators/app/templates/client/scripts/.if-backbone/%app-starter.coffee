'use strict'

<% if (use.bootstrap || use.foundation) { %>### global window ###<% } %>
<% if (use.foundation) { %>### global document ###<% } %>

$ = require 'jquery'
w = require 'when'

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
    w()
      .delay 50 # delay to let karma-test pass
      .then ->
        <% if (use.foundation) { %>$(document).foundation()<% } %>
        return
  title: '<%= appnameCap %>'

module.exports = ->
  app.initialize()
    .then ->
      app
