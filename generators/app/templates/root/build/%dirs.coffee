fs = require 'fs'
path = require 'path'
_ = require 'lodash'

config = require 'config'

dirs =
  bower:  JSON.parse(fs.readFileSync './.bowerrc').directory
  src:
    root:   '<%= dirs.src %>'
    server: '<%= dirs.serverSrc %>'
    client: '<%= dirs.clientSrc %>'
  test:
    root:   '<%= dirs.test %>'
    server: '<%= dirs.test %>/server'
    client: '<%= dirs.test %>/client'
  tgt: _.clone(config.dirs.tgt) || {}

_.defaults dirs.tgt,
  root: '.tmp'

_.defaults dirs.tgt,
  server: path.join dirs.tgt.root, 'server'
  client: path.join dirs.tgt.root, 'client'
  config: path.join dirs.tgt.root, 'config'

_.defaults dirs.tgt,
  clientVendor: path.join dirs.tgt.client, 'vendor'


module.exports = dirs
