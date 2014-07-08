'use strict';
/* global define, Backbone */

define(['templates'], function (templates) {
  var View = Backbone.View.extend({
    initialize: function (options) {
      this.templateName = options.templateName;
      this.app = options.app;
    },
    render: function () {
      var templateName = this.templateName;
      var template = templates[templateName];
      this.$el.html(template({title: this.app.title}));
      return this;
    }
  });
  return View;
});

