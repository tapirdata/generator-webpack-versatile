'use strict';
/* global define */

define(['templates'], function (templates) {
  var App = {
    initialize: function () {
      console.log('App.initialize');
      // console.log('templates=', templates);
      // console.log('otto=', templates.otto);
      // console.log('otto({attr: 123})=', templates.otto({attr: 123}));
    },
  };
  return App;
});
