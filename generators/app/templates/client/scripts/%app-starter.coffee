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
    @amendPage()
      .then =>
<% if (use.backbone) { -%>
        Router = require './router'
        new Router app: @
<% } else { -%>
        @instrumentPage()
<% } -%>

  amendPage: ->
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
    w()
<% if (use.foundation) { -%>
      .then ->
        # console.log 'run foundation()'
        $(document).foundation()
        return
<% } -%>

  title: '<%= appnameCap %>'

module.exports = ->
  app.initialize()
    .then ->
      app
