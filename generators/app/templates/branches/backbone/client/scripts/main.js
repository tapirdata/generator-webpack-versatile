'use strict';

require.config({
  paths: {
    jquery:     '/vendor/jquery/dist/jquery',
    underscore: '/vendor/lodash/dist/lodash',
    backbone:   '/vendor/backbone/backbone',
    bootstrap:  '/vendor/bootstrap-sass-official/assets/javascripts/bootstrap',
    jade:       '/vendor/jade/runtime'
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
