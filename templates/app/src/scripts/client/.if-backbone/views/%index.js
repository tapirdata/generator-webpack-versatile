<% if (use.marionette) { -%>
import Marionette from 'backbone.marionette';
<% } else { -%>
import Backbone from 'backbone';
<% } -%>
import $ from 'jquery';

import { allSections, sectionTitles } from '../../../config/constants';
import menuToggler from '../../../templates/_menu-toggler.pug';
import footer from '../../../templates/_footer.pug';

<% if (use.marionette) { -%>
class BaseView extends Marionette.View {
<% } else { -%>
class BaseView extends Backbone.View {
<% } -%>
  initialize(options) {
    this.app = options.app;
    this.template = options.template;
    this.section = options.section;

    this.params = {
      constants: {
        title: this.app.options.title,
        allSections,
        sectionTitles,
      },
      section: this.section,
      parts: {},
      linkingMode: 'client',
    };
  }
}

class PageView extends BaseView {

  render() {
    this.$el.html(this.template(this.params));

    let $footer = $('#footer');
    $footer.replaceWith(footer(this.params));

    return Promise.resolve();
  }
}

class MainNavView extends BaseView {

  render() {
    this.$el.html(this.template(this.params));

    let $menuToggler = $('div.menu-toggler');
    $menuToggler.replaceWith(menuToggler(this.params));

    return Promise.resolve();
  }

}

export { PageView, MainNavView };
