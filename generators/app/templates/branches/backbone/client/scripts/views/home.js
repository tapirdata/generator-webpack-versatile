'use strict';
/* global define, Backbone, $ */

define(['templates'], function (templates) {
  var View = Backbone.View.extend({
    render: function () {
      var tplName = 'home';
      var template = templates[tplName];
      console.log('view home: render');
      $('.container').html(template({title: 'Express/Backbone'}));
    }
  });
  return View;
});

