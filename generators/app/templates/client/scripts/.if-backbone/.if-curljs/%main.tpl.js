'use strict';
/* global curl */

var appBaseUrl = '<%%= appBaseUrl %>';
var vendorBaseUrl = '<%%= vendorBaseUrl %>';

curl.config({
  paths: {
    curl:       vendorBaseUrl + '/curl/src/curl',
    jquery:     vendorBaseUrl + '/jquery/dist/jquery',
    underscore: vendorBaseUrl + '/lodash/dist/lodash',<% if (includeBackbone) { %>
    backbone: {
      location: vendorBaseUrl + '/backbone/backbone',
      transform: 'curl/cjsm11'
    },<% } %><% if (includeBootstrap) { %>
    bootstrap: {
      location: vendorBaseUrl + '/bootstrap-sass-official/assets/javascripts/bootstrap',
      config: {
        loader: 'curl/loader/legacy',
        factory: function() {}
      }
    },<% } %>
    jade:       vendorBaseUrl + '/jade/runtime',
    // mocha:          vendorBaseUrl + '/mocha/mocha',
    // chai:           vendorBaseUrl + '/chai/chai',
    // chaiAsPromises: vendorBaseUrl + '/chai/chai-as-promised'
    // chaiJq:         vendorBaseUrl + '/chai-jq/chai-jq'
  },
  preloads: ['jquery']
});

curl([
  appBaseUrl + '/scripts/app'<% if (includeBootstrap) { %>,
  'bootstrap'<% } %>
], function (App) {
  App.initialize();
});
