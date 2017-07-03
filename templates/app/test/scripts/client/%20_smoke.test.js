/* eslint-env mocha  */

import $ from 'jquery';
import chai from 'chai';
import appStarter from '../../../src/scripts/client/app-starter';
import Gasper from './gasper';

let { expect } = chai;

let gasper = new Gasper({
  headFilter($child) {
    return !$child.is('script');
  }
});

describe('The Application', function() {
  this.timeout(10000);
  before(() =>
    gasper.show('/')
      .then(() => appStarter())
      .then(function(app) {
        gasper.app = app;
      })
  );
  it('should show the home page', () => {
    expect($('div.jumbotron')).to.have.length(1);
    expect($('#main-nav li.item').eq(0)).$class('active');
  });
  it('home page should show the yeoman image', () =>
    Promise.resolve()
      .then(() => gasper.retry(() => {
        let $imgs = $('img[alt="the yeoman"]');
        expect($imgs).to.have.length(1);
        let img = $imgs[0];
        expect(img.naturalWidth).above(10);
        expect(img.naturalHeight).above(10);
      }))
  );
<% if (use.foundation) { -%>
  it('home page should have the stylesheet applied', () =>
    Promise.resolve()
      .then(() => gasper.retry(() => {
        let $btn = $('.button.success');
        expect($btn).to.have.$css('background-color', 'rgb(58, 219, 118)');
      }))
  );
<% } -%>
<% if (use.bootstrap) { -%>
  it('home page should have the stylesheet applied', () =>
    Promise.resolve()
      .then(() => gasper.retry(() => {
        let $btn = $('.btn-success');
        expect($btn).to.have.$css('background-color', 'rgb(92, 184, 92)');
      }))
  );
<% } -%>
  it('should show the about page', () =>
    Promise.resolve()
      .then(gasper.delay(200))
      .then(() =>
        gasper.activate($('#main-nav li.item a').eq(1))
      )
      .then(() => gasper.retry(function() {
        expect($('div.jumbotron')).to.have.length(0);
        expect($('h1').text()).to.contain('About');
      }))
  );

  it('should show the contact page', () =>
    Promise.resolve()
      .then(gasper.delay(200))
      .then(() =>
        // console.log 'click contact'
        gasper.activate($('#main-nav li.item a').eq(2))
      )
      .then(() => gasper.retry(function() {
        expect($('div.jumbotron')).to.have.length(0);
        expect($('h1').text()).to.contain('Contact');
      }))
  );
  return it('should show the home page again', () =>
    Promise.resolve()
      .then(gasper.delay(200))
      .then(() =>
        // console.log 'click home'
        gasper.activate($('#main-nav li.item a').eq(0))
      )
      .then(() => gasper.retry(() =>
        expect($('div.jumbotron')).to.have.length(1))
      )
  );
});

