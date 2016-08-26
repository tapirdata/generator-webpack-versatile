import Marionette from 'backbone.marionette';

class SimpleView extends Marionette.View {
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

