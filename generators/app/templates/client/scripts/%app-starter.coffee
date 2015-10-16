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
Backbone.$ = $
<% } -%>

<% if (use.bootstrap) { -%>
window.jQuery = $ # bootstrap needs this
require 'bootstrap-sass'
<% } -%>

app =
  initialize: ->
    console.log 'app.initialize'
<% if (use.backbone) { -%>
    Router = require './router'
    new Router app: @
    @amendPage()
<% } else { -%>
    @amendPage()
      .then =>
        @instrumentPage()
<% } -%>

  amendPage: ->
<% if (use.foundation) { -%>
    window.jQuery = $ # foundation needs this
    $.getScript '/vendor/foundation/foundation.js'
<% } -%>
    w()

  instrumentPage: ->
    w()
<% if (use.foundation) { -%>
      .delay 40  # ensure css is recognized
      .then ->
        $(document).foundation()
        return
<% } -%>

  title: '<%= appnameCap %>'

module.exports = ->
  app.initialize()
    .then ->
      app
