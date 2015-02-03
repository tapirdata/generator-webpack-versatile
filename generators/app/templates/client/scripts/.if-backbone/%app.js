'use strict';
/* global define */

define(['./router'], function (Router) {
  var App = {
    initialize: function () {
      console.log('App.initialize');
      new Router({app: this});
    },
    title: '<%= _.capitalize(appname) %>',
  };
  return App;
});
