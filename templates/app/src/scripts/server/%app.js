import path from 'path';
import express from 'express';
import routesFactory from './routes/main';
import compression from 'compression';
import favicon from 'serve-favicon';
import robots from 'robots.txt';

export default function(options) {
  const app = express();
  app.set('views', path.join(__dirname, '..', 'templates'));
  app.set('view engine', 'pug');
  app.locals.pretty = true;
  app.use(compression());
  app.use(favicon(path.join(options.clientDir, 'images', 'favicon.ico')));
  app.use(robots(path.join(options.clientDir, 'pages', 'robots.txt')));
  app.use('<%= urls.staticBase %>', express.static(options.clientDir));
  app.use('/', routesFactory(options));
  return app;
}
