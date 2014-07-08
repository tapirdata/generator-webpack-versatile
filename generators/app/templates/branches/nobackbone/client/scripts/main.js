'use strict';

require.config({
  paths: {
    jade: '/static/vendor/jade/runtime'
  }
});

require([
  'app',
], function (App) {
  App.initialize();
});
