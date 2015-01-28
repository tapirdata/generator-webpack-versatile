'use strict'

define(['jquery', 'when', 'chai', 'app/scripts/templates'], function($, when, chai, templates) {

  var expect = chai.expect;

  describe('The Foo Tests', function () {

    it ('should equal', function() {
      expect(3 * 2).equal(6);
    });

    it ('jquery should have Deferred', function() {
      expect($.Deferred).is.a('function');
    });

    it ('promise should resolve', function() {
       var p = when(6*4);
       return expect(p).to.eventually.be.equal(24);
    });

    it ('templates should have "about"', function() {
      expect(templates).to.have.property('about');
    });

  });

});


