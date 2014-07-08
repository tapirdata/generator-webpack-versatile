'use strict';
/* global define */

define(['router'], function (Router) {
  var App = {
    initialize: function () {
      console.log('App.initialize');
      new Router();
    },
  };
  return App;
});
