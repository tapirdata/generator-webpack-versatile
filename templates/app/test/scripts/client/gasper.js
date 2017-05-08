/* global window */

import $ from 'jquery';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiJq from 'chai-jq';
chai.use(chaiAsPromised);
chai.use(chaiJq);

function lift(fn) {
  return function(...args) {
    return Promise.resolve()
    .then(() => fn.apply(this, args));
  };
}


function delay(duration) {
  return function() {
    return new Promise(function(resolve) {
      window.setTimeout(resolve, duration);
    });
  };
}


class Gasper {
  constructor(options) {
    this.headFilter = options.headFilter;
    this.bodyFilter = options.bodyFilter;
    this.app = null;
  }

  splitHtml(html) {
    html = html
    .replace(/<(html|head|body)>/g, '<div class="_$1_">')
    .replace(/<\/(html|head|body)>/g, '</div>');
    const $html = $(html);
    return {
      $head: $html.find('div._head_'),
      $body: $html.find('div._body_')
    };
  }

  gaspHtml(html) {
    const options = options || {};
    const hs = this.splitHtml(html);

    $('head').html('');
    $('body').html('');
    {
      const filter = this.headFilter;
      hs.$head.children().each(function() {
        const $this = $(this);
        if (!filter || filter($this)) {
          $('head').append($this);
        }
      });
    }
    {
      const filter = this.bodyFilter;
      hs.$body.children().each(function() {
        const $this = $(this);
        if (!filter || filter($this)) {
          $('body').append($this);
        }
      });
    }
  }

  show(location) {
    if (location[0] === '#') {
      window.location = location;
      return Promise.resolve();
    } else {
      return $.get(location)
      .then(html => {
        this.gaspHtml(html);
        const { app } = this;
        if (app) {
          return app.amendPage()
          .then(
            () => app.instrumentPage()
          );
        }
      });
    }
  }

  activate($a) {
    if ($a.data('linking') == 'client') {
      $a[0].click();
      return Promise.resolve();
    } else {
      return this.show($a.attr('href'));
    }
  }

  retry(grace, steps, fn) {

    function _retry (dt, left, wrappedFn) {
      const result = wrappedFn();
      if (left <= 0) {
        return result;
      } else {
        return result
        .catch(() =>
          Promise.resolve()
          .then(delay(dt))
          .then(() => _retry(dt, left - 1, wrappedFn))
        );
      }
    }

    if (typeof steps === 'function') {
      fn = steps;
      steps = 10;
    } else if (typeof grace === 'function') {
      fn =  grace;
      steps = 10;
      grace = 1000;
    }
    return _retry(grace / steps, steps, lift(fn));
  }

}

Gasper.prototype.delay = delay;

export default Gasper;


