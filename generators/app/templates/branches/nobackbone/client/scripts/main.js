'use strict';

require.config({
  paths: {
    jade: '/vendor/jade/runtime'
  }
});

require([
  'app',
], function (App) {
  App.initialize();
});
