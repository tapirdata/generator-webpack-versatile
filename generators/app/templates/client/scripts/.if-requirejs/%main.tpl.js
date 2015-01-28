'use strict';

var appBaseUrl = '<%%= appBaseUrl %>';
var vendorBaseUrl = '<%%= vendorBaseUrl %>';

require.config({
  paths: {
    jquery:     vendorBaseUrl + '/jquery/dist/jquery',
    underscore: vendorBaseUrl + '/lodash/dist/lodash'<% if (includeBackbone) { %>,
    backbone:   vendorBaseUrl + '/backbone/backbone'<% } %><% if (includeBootstrap) { %>,
    bootstrap:  vendorBaseUrl + '/bootstrap-sass-official/assets/javascripts/bootstrap'<% } %>,
    jade:       vendorBaseUrl + '/jade/runtime',
    mocha:      vendorBaseUrl + '/mocha/mocha',
    chai:       vendorBaseUrl + '/chai/chai',
    chaiAsPromises: vendorBaseUrl + '/chai/chai-as-promised'
  },
  shim: {
    'bootstrap': {
      deps: ['jquery']
    }
  }
});

require([
  'app'<% if (includeBootstrap) { %>,
  'bootstrap'<% } %>
], function (App) {
  App.initialize();
});
