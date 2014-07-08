'use strict';
/* global define, Backbone */

define(['views/simple'], function (SimpleView) {
  var AppRouter = Backbone.Router.extend({
    initialize: function () {
      console.log('AppRouter.initialize');
      Backbone.history.start();
    },

    routes: {
      '':         'showHome',
      'about':    'showAbout',
      '*actions': 'defaultAction'
    },

    targetEl: '#body-container',

    showHome: function () {
      var view = new SimpleView({el: this.targetEl, templateName: 'home'});
      view.render();
    },

    showAbout: function () {
      var view = new SimpleView({el: this.targetEl, templateName: 'about'});
      view.render();
    },

    defaultAction: function () {
      console.log('defaultAction');
      this.showHome();
    }

  });

  return AppRouter;
});
