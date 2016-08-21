import path from 'path';
import express from 'express';
import routes from './routes/main';
import favicon from 'serve-favicon';
import robots from 'robots.txt';

export default function(options) {
  const app = express();
  app.set('views', path.join(__dirname, '..', 'templates'));
  app.set('view engine', 'jade');
  app.locals.pretty = true;
  app.use(favicon(path.join(options.clientDir, 'images', 'favicon.ico')));
  app.use(robots(path.join(options.clientDir, 'pages', 'robots.txt')));
  app.use('/app', express.static(options.clientDir));
  app.use('/vendor', express.static(options.vendorDir));
  app.use('/', routes);
  return app;
}
