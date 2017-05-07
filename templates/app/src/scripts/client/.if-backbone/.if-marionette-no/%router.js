import Backbone from 'backbone';

class Router extends Backbone.Router {

  initialize(options) {
    this.controller = options.controller;
    this.targetEl = '#body-container';
  }

  showSection(section) {
    this.controller.showSection(section);
  }

  defaultAction() {
    this.controller.defaultAction();
  }
}


Router.prototype.routes = {
  'section/:section/': 'showSection',
  '*actions': 'defaultAction'
};

export default Router;


