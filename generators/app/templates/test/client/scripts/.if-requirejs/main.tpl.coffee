'use strict'
testBaseUrl = '<%= testBaseUrl %>'
appBaseUrl = '<%= appBaseUrl %>'
vendorBaseUrl = '<%= vendorBaseUrl %>'
require.config
  baseUrl: '/base'
  paths:
    test: testBaseUrl
    app: appBaseUrl
    jade: vendorBaseUrl + '/jade/runtime'
    jquery: vendorBaseUrl + '/jquery/dist/jquery'
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
# console.log('files=', window.__karma__.files);
require [ 'test/scripts/runner' ], (runner) ->
  runner()
  return
