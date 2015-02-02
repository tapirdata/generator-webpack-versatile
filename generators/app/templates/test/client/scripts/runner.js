'use strict';
/* global define, window */

define(function() {
  var allTestFiles = [];
  var TEST_REGEXP = /^\/base\/\.tmp\/.*(spec|test)\.js$/i;

  var pathToModule = function(path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
  };

  Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
      // Normalize paths to RequireJS module names.
      allTestFiles.push(pathToModule(file));
    }
  });

  // console.log('allTestFiles=', allTestFiles);
  return function() {
    require(allTestFiles, function() {
      window.__karma__.start();
    });
  };

});


