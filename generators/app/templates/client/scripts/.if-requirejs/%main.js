'use strict';

require.config({
  paths: {
    jquery:     '/vendor/jquery/dist/jquery',
    underscore: '/vendor/lodash/dist/lodash'<% if (includeBackbone) { %>,
    backbone:   '/vendor/backbone/backbone'<% } %><% if (includeBootstrap) { %>,
    bootstrap:  '/vendor/bootstrap-sass-official/assets/javascripts/bootstrap'<% } %>,
    jade:       '/vendor/jade/runtime',
    mocha:      '/vendor/mocha/mocha',
    chai:       '/vendor/chai/chai',
    chaiAsPromises: '/vendor/chai/chai-as-promised'
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
