import Backbone from 'backbone';
import $ from 'jquery';

import { allSections, sectionTitles } from '../../../config/constants';
import menuToggler from '../../../templates/_menu-toggler.pug';
import footer from '../../../templates/_footer.pug';

class BaseView extends Backbone.View {
  initialize(options) {
    this.app = options.app;
    this.title = options.title;
    this.template = options.template;
    this.section = options.section;
  }
}

class PageView extends BaseView {
  render() {
    this.$el.html(this.template({
    }));

    let $footer = $('#footer');
    $footer.replaceWith(footer());

    return Promise.resolve();
  }
}

class MainNavView extends BaseView {

  render() {
    this.$el.html(this.template({
      app: this.app,
      section: this.section,
      allSections,
      sectionTitles,
    }));

    let $menuToggler = $('div.menu-toggler');
    $menuToggler.replaceWith(menuToggler());

    return Promise.resolve();
  }

}

export { PageView, MainNavView };

