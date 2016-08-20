import SimpleView from './views/simple';

<% if (use.marionette) { -%>
import Marionette from 'backbone.marionette';
class Controller extends Marionette.Object {
<% } else { -%>
class Controller {
  constructor(options) {
    this.initialize(options);
  }
<% } -%>

  initialize(options) {
    this.targetEl = '#body-container';
    this.app = options.app;
    this.currentView = null;
  }

  _showView(view) {
    return view.render()
    .then(() => {
      return this.app.instrumentPage()
        .then(() => {
          this.currentView = view;
        }
      );
    });
  }

  _showTemplate(template) {
    return this._showView(new SimpleView({
      el: this.targetEl,
      template,
      app: this.app
    })
    );
  }

  showHome() {
    return this._showTemplate(require('../templates/home.jade'));
  }

  showAbout() {
    return this._showTemplate(require('../templates/about.jade'));
  }

  showContact() {
    return this._showTemplate(require('../templates/contact.jade'));
  }

  defaultAction() {
    return this.showHome();
  }
}

export default Controller;

