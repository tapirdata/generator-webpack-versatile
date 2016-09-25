import fs from 'fs';
import path from 'path';
import _ from 'lodash';

function dirsFactory(root, config) {

  let dirs = {
    root: root,
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
    server: path.join(dirs.tgt.root, 'server'),
    client: path.join(dirs.tgt.root, 'client')
  });

  _.defaults(dirs.tgt, {
    clientVendor: path.join(dirs.tgt.client, 'vendor'),
    serverTest: path.join(dirs.tgt.server, 'test')
  });

  return dirs;
}

export default dirsFactory;
