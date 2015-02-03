'use strict';
/* global define */

define(['backbone', './views/simple'], function (Backbone, SimpleView) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      '':         'showHome',
      'about':    'showAbout',
      '*actions': 'defaultAction'
    },

    targetEl: '#body-container',

    initialize: function (options) {
      console.log('AppRouter.initialize');
      this.app = options.app;
      this.homeView  = new SimpleView({el: this.targetEl, templateName: 'home', app: this.app});
      this.aboutView = new SimpleView({el: this.targetEl, templateName: 'about', app: this.app});
      Backbone.history.start();
    },

    showHome: function () {
      this.homeView.render();
    },

    showAbout: function () {
      this.aboutView.render();
    },

    defaultAction: function () {
      console.log('defaultAction');
      this.showHome();
    }

  });

  return AppRouter;
});
