import $ from 'jquery';
import Backbone from 'backbone';

class SimpleView extends Backbone.View {
  initialize(options) {
    this.template = options.template;
    this.app = options.app;
  }

  render() {
    this.$el.html(this.template({title: this.app.title}));
    return Promise.resolve();
  }
}

export default SimpleView;

