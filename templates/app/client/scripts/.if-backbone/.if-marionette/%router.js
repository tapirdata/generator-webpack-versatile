import Marionette from 'backbone.marionette';

class Router extends Marionette.AppRouter {
  initialize() {
    this.appRoutes = {
      '': 'showHome',
      'about': 'showAbout',
      'contact': 'showContact',
      '*actions': 'defaultAction'
    };
  }
}

export default Router;

