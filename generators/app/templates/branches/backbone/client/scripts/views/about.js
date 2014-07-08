'use strict';
/* global define, Backbone, $ */

define(['templates'], function (templates) {
  var View = Backbone.View.extend({
    render: function () {
      var tplName = 'about';
      var template = templates[tplName];
      console.log('view about: render');
      $('.container').html(template({title: 'Express/Backbone'}));
    }
  });
  return View;
});


