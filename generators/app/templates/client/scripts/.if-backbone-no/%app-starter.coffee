'use strict'

<% if (use.bootstrap || use.foundation) { %>### global window ###<% } %>
<% if (use.foundation) { %>### global document ###<% } %>

$ = require 'jquery'
w = require 'when'

<% if (use.bootstrap) { %>
window.jQuery = $ # bootstrap needs this
require 'bootstrap-sass'<% } %><% if (use.foundation) { %>
window.jQuery = $ # foundation needs this
require 'foundation'<% } %>

app =
  initialize: ->
    console.log 'app.initialize'
    w()
      .delay 50 # delay to let karma-test pass
      .then ->
        <% if (use.foundation) { %>$(document).foundation()<% } %>
        return

module.exports = ->
  app.initialize()
    .then ->
      app
