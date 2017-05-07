import Marionette from 'backbone.marionette';

class Router extends Marionette.AppRouter {
  initialize() {
    this.appRoutes = {
      'section/:section/': 'showSection',
      '*actions': 'defaultAction'
    };
  }
}

export default Router;

