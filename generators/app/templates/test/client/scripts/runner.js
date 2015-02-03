'use strict';
/* global define, window */

define(['require'], function(require) {
  var allTestFiles = [];

  // console.log('window.__karma__.config=', window.__karma__.config);
  window.__karma__.config.testFiles.forEach(function(file) {
    var mod = file.replace(/\.js$/, '');
    allTestFiles.push('./' + mod);
  });

  function prepared(cb) {
    require(['poly', 'chai', 'chaiAsPromised', 'chaiJq'], 
      function(poly, chai, chaiAsPromised, chaiJq) {
        chai.use(chaiAsPromised);
        chai.use(chaiJq);
        cb();
      }
    );
  }

  // console.log('allTestFiles=', allTestFiles);
  return function() {
    prepared(function() {
      require(allTestFiles, function() {
        window.__karma__.start();
      });  
    });
  };

});


