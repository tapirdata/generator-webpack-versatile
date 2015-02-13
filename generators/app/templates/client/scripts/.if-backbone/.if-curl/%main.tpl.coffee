'use strict'

### global curl ###

appBaseUrl = '<%%= appBaseUrl %>'
vendorBaseUrl = '<%%= vendorBaseUrl %>'
curl.config
  paths:
    curl: vendorBaseUrl + '/curl/src/curl'
    jquery: vendorBaseUrl + '/jquery/dist/jquery'
    underscore: vendorBaseUrl + '/lodash/dist/lodash'<% if (use.backbone) { %>
    backbone:
      location: vendorBaseUrl + '/backbone/backbone'
      transform: 'curl/cjsm11'
    <% } %><% if (use.bootstrap) { %>bootstrap:
      location: vendorBaseUrl +
        '/bootstrap-sass-official/assets/javascripts/bootstrap'
      config:
        loader: 'curl/loader/legacy'
        factory: ->
    <% } %>jade: vendorBaseUrl + '/jade/runtime'
  preloads: [ 'jquery' ]
curl [
  appBaseUrl + '/scripts/app'<% if (use.bootstrap) { %>
  'bootstrap'<% } %>
], (App) ->
  App.initialize()
  return
