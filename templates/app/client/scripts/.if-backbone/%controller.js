import { PageView, MainNavView } from './views/';
import mainNavTemplate from '../templates/_main-nav.pug';

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
    this.pageTargetEl = '#page-meat';
    this.mainNavTargetEl = '#main-nav';
    this.app = options.app;
    this.currentView = null;
  }

  _showView(pageView, mainNavView) {
    return Promise.all([
      mainNavView.render(),
      pageView.render(),
    ])
    .then(() => {
      return this.app.instrumentPage()
        .then(() => {
          this.currentView = pageView;
          window.scrollTo(0, 0);
        }
      );
    });
  }

  showSection(section) {
    const templatePromises = [
      import(`../templates/${section}.pug`),
    ];
    return Promise.all(templatePromises)
    .then((templates) => {
      const [pageTemplate] = templates;

      const pageView = new PageView({
        el: this.pageTargetEl,
        app: this.app,
        template: pageTemplate,
        section: section,
      });
      const mainNavView = new MainNavView({
        el: this.mainNavTargetEl,
        app: this.app,
        template: mainNavTemplate,
        section: section,
      });
      return this._showView(pageView, mainNavView);
    });
  }

  defaultAction() {
    return this.showSection('home');
  }
}

export default Controller;

