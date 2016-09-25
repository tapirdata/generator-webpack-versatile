<% if (use.bootstrap || use.foundation) { -%>
// global window */
<% } -%>
<% if (use.foundation) { -%>
// global document */
<% } -%>

import $ from 'jquery';
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
      Backbone.history.start();
    });
<% } -%>
  }

<% if (use.backbone) { -%>
  _createRouter() {
    new Router({
      controller: new Controller({
        app: this
      })
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
    Backbone.history.start();
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
      url: '/vendor/foundation/foundation.js',
      dataType: 'script'
    });
<% } else { -%>
    return Promise.resolve();
<% } -%>
  }

  instrumentPage() {
    // things to be done after page contents has been modified
    return Promise.resolve()
<% if (use.foundation) { -%>
    .then(function() {
      $(document).foundation();
    });
<% } -%>
  }

}


export default function() {
  const app = new App();
  return app.launch()
  .then(() => app);
}
