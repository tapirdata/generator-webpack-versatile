import fs = require("fs")
import path = require("path")
import _ = require("lodash")
// tslint:disable-next-line:no-var-requires
const slash = require("slash")

function dirsFactory(root: string, config: any) {

  const dirs: any = {
    root,
    tmp: ".tmp",
    bower: JSON.parse(fs.readFileSync("./.bowerrc", "utf8")).directory,
    src: {
      root:   "<%= dirs.src %>",
    },
    test: {
      root:   "<%= dirs.test %>",
    },
    tgt: _.clone(config.dirs.tgt) || {},
  }

  _.defaults(dirs.src, {
    images:  slash(path.join(dirs.src.root, "images")),
    pages:   slash(path.join(dirs.src.root, "pages")),
    scripts: slash(path.join(dirs.src.root, "scripts")),
    common:  slash(path.join(dirs.src.root, "scripts/common")),
    styles:  slash(path.join(dirs.src.root, "styles")),
    templates: slash(path.join(dirs.src.root, "templates")),
  })

  _.defaults(dirs.test, {
    scripts: slash(path.join(dirs.test.root, "scripts")),
  })

  _.defaults(dirs.tgt, {
    root: ".tmp",
  })

  _.defaults(dirs.tgt, {
    server: slash(path.join(dirs.tgt.root, "server")),
    client: slash(path.join(dirs.tgt.root, "client")),
  })

  _.defaults(dirs.tgt, {
    clientVendor: slash(path.join(dirs.tgt.client, "vendor")),
    serverTest: slash(path.join(dirs.tgt.server, "test")),
  })

  return dirs
}

export default dirsFactory
