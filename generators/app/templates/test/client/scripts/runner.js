'use strict';
/* global define, window */

define(['require'], function(require) {
  var allTestFiles = [];

  // console.log('window.__karma__.config=', window.__karma__.config);
  window.__karma__.config.testFiles.forEach(function(file) {
    var mod = file.replace(/\.js$/, '');
    allTestFiles.push('./' + mod);
  });

  // console.log('allTestFiles=', allTestFiles);
  return function() {
    require(allTestFiles, function() {
      window.__karma__.start();
    });
  };

});


