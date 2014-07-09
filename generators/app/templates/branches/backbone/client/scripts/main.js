'use strict';

require.config({
  paths: {
    jquery:     '/static/vendor/jquery/dist/jquery',
    underscore: '/static/vendor/lodash/dist/lodash',
    backbone:   '/static/vendor/backbone/backbone',
    bootstrap:  '/static/vendor/bootstrap-sass-official/assets/javascripts/bootstrap',
    jade:       '/static/vendor/jade/runtime'
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
