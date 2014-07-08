'use strict';
/* global define, Backbone */

define([], function () {
  var AppRouter = Backbone.Router.extend({
    initialize: function () {
      console.log('AppRouter.initialize');
      Backbone.history.start();
    },

    routes: {
      '':          'showHome',
      'about':     'showAbout',
      '*actiions': 'defaultAction'
    },

    showHome: function () {
      console.log('showHome');
      require(['views/home'], function (View) {
        var view = new View();
        view.render();
      });
    },

    showAbout: function () {
      console.log('showAbout');
      require(['views/about'], function (View) {
        var view = new View();
        view.render();
      });
    },

    defaultAction: function () {
      console.log('defaultAction');
      this.showHome();
    }

  });

  return AppRouter;
});
