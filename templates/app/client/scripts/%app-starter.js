import 'babel-polyfill';
<% if (use.bootstrap || use.foundation) { -%>
// global window */
import $ from 'jquery';
<% } -%>
<% if (use.foundation) { -%>
// global document */
<% } -%>

<% if (use.backbone) { -%>
import Backbone from 'backbone';
import Controller from './controller';
import Router from './router';
<% } -%>
<% if (use.marionette) { -%>
import Marionette from 'backbone.marionette';
<% } -%>

<% if (use.bootstrap) { -%>
window.jQuery = $; // bootstrap needs this
require('bootstrap-sass');
<% } -%>

<% if (use.marionette) { -%>
class App extends Marionette.Application {
<% } else { -%>
class App {
  constructor(options) {
    this.initialize(options);
  }
<% } -%>

  initialize() {
    this.title = '<%= appnameCap %>';
<% if (use.marionette) { -%>
    return this.on('start', function() {
      this._createRouter();
      Backbone.history.start({
        pushState: true,
        root: '/',
      });
      this._catchAnchors();
    });
<% } -%>
  }

<% if (use.backbone) { -%>
  _createRouter() {
    this.router = new Router({
      controller: new Controller({
        app: this
      })
    });
  }

  _catchAnchors() {
    $(document).on('click', 'a[data-internal]', (event) => {
      const href = $(event.currentTarget).attr('href');
      if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        event.preventDefault();
        // Remove leading slases and hash bangs (backward compatablility)
        const url = href.replace(/^\//,'').replace('\#\!\/','');
        this.router.navigate(url, { trigger: true });
      }
    });
  }
<% } -%>

  launch() {
    return this.amendPage()
    .then(() => {
      return this.start();
    });
  }

<% if (!use.marionette) { -%>
  start() {
<% if (use.backbone) { -%>
    this._createRouter();
    Backbone.history.start(
      pushState: true,
      root: '/',
    );
    this._catchAnchors();
<% } else { -%>
    return this.instrumentPage();
<% } -%>
  }
<% } -%>

  amendPage() {
    // things to be done on first page load

<% if (use.foundation) { -%>
    window.jQuery = $;    // foundation 6.2.3 needs this
    $.fn.load = function(fn) {  // foundation 6.2.3 still uses deprecated '$.fn.load'
      return this.on('load', fn);
    };

    return $.ajax({ // load script async
      url: '<%= urls.staticBase %>/vendor/foundation/foundation.js',
      dataType: 'script'
    });
<% } else { -%>
    return Promise.resolve();
<% } -%>
  }

  instrumentPage() {
    // things to be done after page contents has been modified
<% if (use.foundation) { -%>
    return Promise.resolve()
    .then(function() {
      $(document).foundation();
    });
<% } else { -%>
    return Promise.resolve();
<% } -%>
  }

}


export default function() {
  const app = new App();
  return app.launch()
  .then(() => app);
}
