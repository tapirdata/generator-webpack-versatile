'use strict';
/* global curl */

var testBaseUrl = '<%= testBaseUrl %>';
var appBaseUrl = '<%= appBaseUrl %>';
var vendorBaseUrl = '<%= vendorBaseUrl %>';

curl.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths: {
    test: testBaseUrl,
    app: appBaseUrl,
    jade:   vendorBaseUrl + '/jade/runtime',
    jquery: vendorBaseUrl + '/jquery/dist/jquery',
    chai: vendorBaseUrl + '/chai/chai',
    chaiAsPromised: vendorBaseUrl + '/chai-as-promised/lib/chai-as-promised'
  },

  packages: [
    {
      name: 'poly',
      location: vendorBaseUrl + '/poly',
      main: 'poly'
    },
    {
      name: 'when',
      location: vendorBaseUrl + '/when',
      main: 'when'
    }
  ],

});

curl(['poly', 'chai', 'chaiAsPromised', 'test/scripts/runner'], 
  function(poly, chai, chaiAsPromised, runner) {
    chai.use(chaiAsPromised);
    runner();
  }
);
