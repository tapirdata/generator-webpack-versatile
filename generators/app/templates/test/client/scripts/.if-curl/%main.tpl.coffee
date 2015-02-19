'use strict'

### global curl ###

testBaseUrl = '<%%= testBaseUrl %>'
appBaseUrl = '<%%= appBaseUrl %>'
vendorBaseUrl = '<%%= vendorBaseUrl %>'

curl.config
  baseUrl: '/base'

  paths:
    app: appBaseUrl
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
  ]<% if (use.bootstrap) { %>
  preloads: ['jquery']<% } %>


curl [
  'test/scripts/runner'<% if (use.bootstrap) { %>
  'bootstrap'<% } %>
], (runner) ->
  runner()
  return
