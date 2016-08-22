import $ from 'jquery';
import Backbone from 'backbone';
import SimpleView from './views/simple';

class Router extends Backbone.Router {

  initialize(options) {
    this.controller = options.controller;
    this.targetEl = '#body-container';
  }

  showHome() {
    this.controller.showHome();
  }

  showAbout() {
    this.controller.showAbout();
  }

  showContact() {
    this.controller.showContact();
  }

  defaultAction() {
    this.controller.defaultAction();
  }
}


Router.prototype.routes = {
  '': 'showHome',
  'about': 'showAbout',
  'contact': 'showContact',
  '*actions': 'defaultAction'
};

export default Router;


