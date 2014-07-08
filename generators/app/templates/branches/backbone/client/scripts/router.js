'use strict';
/* global define, Backbone */

define(['views/simple'], function (SimpleView) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      '':         'showHome',
      'about':    'showAbout',
      '*actions': 'defaultAction'
    },

    targetEl: '#body-container',

    initialize: function () {
      console.log('AppRouter.initialize');
      this.homeView  = new SimpleView({el: this.targetEl, templateName: 'home'});
      this.aboutView = new SimpleView({el: this.targetEl, templateName: 'about'});
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
