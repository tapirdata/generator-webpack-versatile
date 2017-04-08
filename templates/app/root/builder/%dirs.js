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
      server: '<%= dirs.serverSrc %>',
      client: '<%= dirs.clientSrc %>'
    },
    test: {
      root:   '<%= dirs.test %>',
      server: '<%= dirs.test %>/server',
      client: '<%= dirs.test %>/client'
    },
    tgt: _.clone(config.dirs.tgt) || {}
  };

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
