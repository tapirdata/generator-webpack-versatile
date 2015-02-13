'use strict'
# var appBaseUrl = '<%%= appBaseUrl %>';
vendorBaseUrl = '<%%= vendorBaseUrl %>'
require.config
  paths:
    jquery: vendorBaseUrl + '/jquery/dist/jquery'
    underscore: vendorBaseUrl + '/lodash/dist/lodash'<% if (use.backbone) { %>
    backbone: vendorBaseUrl + '/backbone/backbone'<% } %><% if (use.bootstrap) { %>
    bootstrap: vendorBaseUrl +
      '/bootstrap-sass-official/assets/javascripts/bootstrap'<% } %>
    jade: vendorBaseUrl + '/jade/runtime'
  shim: 'bootstrap': deps: [ 'jquery' ]
require [
  'app'<% if (use.bootstrap) { %>
  'bootstrap'<% } %>
], (App) ->
  App.initialize()
  return
