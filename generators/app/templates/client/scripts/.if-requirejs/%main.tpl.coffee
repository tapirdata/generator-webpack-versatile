'use strict'
appBaseUrl = '<%%= appBaseUrl %>'
vendorBaseUrl = '<%%= vendorBaseUrl %>'

require.config
  paths:
    app: appBaseUrl
    jquery: vendorBaseUrl + '/jquery/dist/jquery'
    underscore: vendorBaseUrl + '/lodash/dist/lodash'<% if (use.backbone) { %>
    backbone: vendorBaseUrl + '/backbone/backbone'<% } %><% if (use.bootstrap) { %>
    bootstrap: vendorBaseUrl +
      '/bootstrap-sass-official/assets/javascripts/bootstrap'<% } %>
    jade: vendorBaseUrl + '/jade/runtime'
  packages: [
    {
      name: 'poly'
      location: vendorBaseUrl + '/poly'
      main: 'poly'
    }
    {
      name: 'when'
      location: vendorBaseUrl + '/when'
      main: 'when'
    }
  ]
  shim:
    bootstrap:
      deps: ['jquery']

require [
  'app/scripts/app-starter'<% if (use.bootstrap) { %>
  'bootstrap'<% } %>
], (appStarter) ->
  appStarter()
  return
