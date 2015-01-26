'use strict'

define(['jquery', 'chai', 'chaiAsPromised'], function($, chai, chaiAsPromised) {

  // console.log('chai=', chai);
  // console.log('chaiAsPromised=', chaiAsPromised);

  chai.use(chaiAsPromised);

  var expect = chai.expect;

  describe('The Otto: Tests', function () {

    it ('should equal', function() {
      expect(3 * 2).equal(6);
    });

    it ('jquery should have Deferred', function() {
      expect($.Deferred).is.a('function');
    });

    // it ('promise should resolve', function() {
    //    var p = when(6*4);
    //    return expect(p).to.eventually.be.equal(25);
    // });

  });

});


