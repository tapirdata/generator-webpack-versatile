'use strict';
/* global define, Backbone */

define(['templates'], function (templates) {
  var View = Backbone.View.extend({
    initialize: function (options) {
      this.templateName = options.templateName;
    },
    render: function () {
      var templateName = this.templateName;
      var template = templates[templateName];
      this.$el.html(template({title: 'Express/Backbone'}));
      return this;
    }
  });
  return View;
});

