'use strict'
appBaseUrl = '<%%= appBaseUrl %>'
testBaseUrl = '<%%= testBaseUrl %>'
vendorBaseUrl = '<%%= vendorBaseUrl %>'

require.config
  baseUrl: '/base'
  paths:
    app: appBaseUrl
    jquery: vendorBaseUrl + '/jquery/dist/jquery'
    underscore: vendorBaseUrl + '/lodash/dist/lodash'<% if (use.backbone) { %>
    backbone: vendorBaseUrl + '/backbone/backbone'<% } %><% if (use.bootstrap) { %>
    bootstrap: vendorBaseUrl +
      '/bootstrap-sass-official/assets/javascripts/bootstrap'<% } %>
    jade: vendorBaseUrl + '/jade/runtime'
    # test specific
    test: testBaseUrl
    chai: vendorBaseUrl + '/chai/chai'
    chaiAsPromised: vendorBaseUrl + '/chai-as-promised/lib/chai-as-promised'
    chaiJq: vendorBaseUrl + '/chai-jq/chai-jq'
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
  'test/scripts/runner'<% if (use.bootstrap) { %>
  'bootstrap'<% } %>
], (runner) ->
  runner()
  return
