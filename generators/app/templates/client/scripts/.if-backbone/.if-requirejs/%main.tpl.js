'use strict';

// var appBaseUrl = '<%%= appBaseUrl %>';
var vendorBaseUrl = '<%%= vendorBaseUrl %>';

require.config({
  paths: {
    jquery:     vendorBaseUrl + '/jquery/dist/jquery',
    underscore: vendorBaseUrl + '/lodash/dist/lodash'<% if (use.backbone) { %>,
    backbone:   vendorBaseUrl + '/backbone/backbone'<% } %><% if (use.bootstrap) { %>,
    bootstrap:  vendorBaseUrl + '/bootstrap-sass-official/assets/javascripts/bootstrap'<% } %>,
    jade:       vendorBaseUrl + '/jade/runtime',
    // mocha:          vendorBaseUrl + '/mocha/mocha',
    // chai:           vendorBaseUrl + '/chai/chai',
    // chaiAsPromises: vendorBaseUrl + '/chai/chai-as-promised'
    // chaiJq:         vendorBaseUrl + '/chai-jq/chai-jq'
  },
  shim: {
    'bootstrap': {
      deps: ['jquery']
    }
  }
});

require([
  'app'<% if (use.bootstrap) { %>,
  'bootstrap'<% } %>
], function (App) {
  App.initialize();
});
