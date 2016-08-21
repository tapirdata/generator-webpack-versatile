import _ from 'lodash';
import http from 'http';

import setupFactory from './setup';
import appFactory from './app';

export default function(appOptions = {}) {
  const defaultOptions = setupFactory();
  const options = _.defaultsDeep({}, appOptions, defaultOptions.app);
  const app = appFactory(options);
  return new Promise(function(resolve) {
    const server = http.createServer(app);
    server.listen(options.port, function() {
      // eslint-disable-next-line no-console
      console.log(`Express server listening on port ${options.port}`);
      resolve(server);
    });
  });
}
