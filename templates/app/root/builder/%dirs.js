import fs from 'fs';
import path from 'path';
import slash from 'slash';
import _ from 'lodash';

function dirsFactory(root, config) {

  let dirs = {
    root: root,
    tmp: '<%= dirs.tmp %>',
    bower:  JSON.parse(fs.readFileSync('./.bowerrc')).directory,
    src: {
      root:   '<%= dirs.src %>',
    },
    test: {
      root:   '<%= dirs.test %>',
    },
    tgt: _.clone(config.dirs.tgt) || {}
  };

  _.defaults(dirs.src, {
    config:  slash(path.join(dirs.src.root, 'config')),
    images:  slash(path.join(dirs.src.root, 'images')),
    pages:   slash(path.join(dirs.src.root, 'pages')),
    scripts: slash(path.join(dirs.src.root, 'scripts')),
    styles:  slash(path.join(dirs.src.root, 'styles')),
    templates: slash(path.join(dirs.src.root, 'templates')),
  });

  _.defaults(dirs.test, {
    scripts: slash(path.join(dirs.test.root, 'scripts')),
  });

  _.defaults(dirs.tgt, {
    root: '.tmp'
  });

  _.defaults(dirs.tgt, {
    server: slash(path.join(dirs.tgt.root, 'server')),
    client: slash(path.join(dirs.tgt.root, 'client'))
  });

  _.defaults(dirs.tgt, {
    clientVendor: slash(path.join(dirs.tgt.client, 'vendor')),
    serverTest: slash(path.join(dirs.tgt.server, 'test'))
  });

  return dirs;
}

export default dirsFactory;
