'use strict'

<% if (use.bootstrap || use.foundation) { %>### global window ###<% } %>
<% if (use.foundation) { %>### global document ###<% } %>

$ = require 'jquery'
<% if (use.bootstrap) { %>
window.jQuery = $ # bootstrap needs this
require 'bootstrap-sass'<% } %><% if (use.foundation) { %>
window.jQuery = $ # foundation needs this
require 'foundation'<% } %>

app =
  initialize: ->
    console.log 'app.initialize'<% if (use.foundation) { %>
    $(document).foundation()<% } %>
    return

module.exports = ->
  app.initialize()
  app
