import path = require("path")
import del = require("del")
import gulp = require("gulp")
import gutil = require("gulp-util")
import child_process = require("child_process")
import _ = require("lodash")

import { Builder } from "./builder"

const builder = new Builder()
const plugins = builder.plugins
const gp = builder.globPatterns
// tslint:disable-next-line:no-var-requires
const serverTsOptions = require("./config/tsconfig-server.json")

function exitAfter() {
  setTimeout(() => {
    gutil.log('exitAfter')
    process.exit()
  }, 100)
  return Promise.resolve()
}

function mapScript(p: string) {
  return gutil.replaceExtension(p, ".js")
}

gulp.task("clean", () =>
  del(builder.dirs.tgt.root)
)

gulp.task("build-server-scripts", () => {
  const dest = `${builder.dirs.tgt.server}/scripts`
  return gulp.src(gp.SCRIPT, {cwd: `${builder.dirs.src.scripts}/server`})
    .pipe(builder.plumber())
    .pipe(plugins.newer({dest, map: mapScript}))
    .pipe(builder.makeScriptPipe(serverTsOptions))
    .pipe(gulp.dest(dest))
    .pipe(builder.sync.reloadServer())
    .pipe(builder.mocha.rerunIfWatch())
})

gulp.task("lint-server-scripts", () => {
  return gulp.src(gp.SCRIPT, {cwd: `${builder.dirs.src.scripts}/server`})
    .pipe(builder.plumber())
    .pipe(plugins.tslint({
      formatter: "stylish",
    }))
    .pipe(plugins.tslint.report({
      summarizeFailureOutput: true,
    }))
})

gulp.task("build-server-templates", () => {
  const dest = `${builder.dirs.tgt.server}/templates`
  return gulp.src([gp.PUG], {cwd: `${builder.dirs.src.templates}`})
    .pipe(builder.plumber())
    .pipe(plugins.newer({dest}))
    .pipe(plugins.ejs({builder}))
<% if (use.crusher) { -%>
    .pipe(builder.crusher.puller())
<% } -%>
    .pipe(gulp.dest(dest))
    .pipe(builder.sync.reloadServer())
    .pipe(builder.mocha.rerunIfWatch())
})

gulp.task("build-server-common", () => {
  const dest = `${builder.dirs.tgt.server}/common`
  return gulp.src([gp.ALL], {cwd: `${builder.dirs.src.common}`})
    .pipe(builder.plumber())
    .pipe(plugins.ejs({builder}))
    .pipe(builder.makeScriptPipe(serverTsOptions))
    .pipe(gulp.dest(dest))
})

gulp.task("build-starter", () => {
  const dest = __dirname
  return gulp.src(gp.JS, {cwd: `${builder.dirs.src.scripts}/starter`})
    .pipe(builder.plumber())
    .pipe(plugins.ejs({builder}))
    .pipe(gulp.dest(dest))
})

gulp.task("build-client-bundles", () => {
  const opt = {
    entry: [
      path.join(builder.dirs.src.scripts, "client", "main.ts"),
      path.join(builder.dirs.src.templates, "**/*.pug"),
    ],
    uglify: builder.config.mode.isProduction,
  }
  if (builder.watchEnabled) {
    return builder.bundler.startDevServer(opt)
  } else {
    const dest = `${builder.dirs.tgt.client}/bundles`
    return builder.bundler.createStream(opt)
      .pipe(gulp.dest(dest))
  }
})

gulp.task("build-client-images", () =>
  gulp.src([gp.ALL], {cwd: `${builder.dirs.src.images}`})
    .pipe(builder.plumber())
<% if (use.crusher) { -%>
    .pipe(builder.crusher.pusher())
<% } -%>
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/images`))
    .pipe(builder.sync.reloadClient()),
)

gulp.task("build-client-pages", () =>
  gulp.src([gp.ALL], {cwd: `${builder.dirs.src.pages}`})
    .pipe(builder.plumber())
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/pages`))
    .pipe(builder.sync.reloadClient()),
)

gulp.task("build-client-styles", () => {
  const templateConfig: any = {}
<% if (use.sass) { -%>
  const includePaths: string[] = []
<% if (use.bootstrap) { -%>
  templateConfig.bootstrapSassPath = "node_modules/bootstrap-sass/assets/stylesheets"
  templateConfig.bootstrapSassMain = templateConfig.bootstrapSassPath + "/" + "_bootstrap.scss"
<% } -%>
<% if (use.foundation) { -%>
  templateConfig.foundationSassPath = "node_modules/foundation-sites/scss"
  templateConfig.foundationSassMain = templateConfig.foundationSassPath + "/" + "foundation.scss"
  includePaths.push(templateConfig.foundationSassPath)
<% } -%>
  const sassFilter = plugins.filter([gp.SASS], {restore: true})
  const scssFilter = plugins.filter([gp.SCSS], {restore: true})
  return gulp.src([gp.CSS, gp.SASS, gp.SCSS], {cwd: `${builder.dirs.src.styles}`})
<% } else { -%>
  return gulp.src([gp.CSS], {cwd: `${builder.dirs.src.styles}`})
<% } -%>
    .pipe(builder.plumber())
    .pipe(plugins.ejs(templateConfig))
<% if (use.sass) { -%>
    .pipe(sassFilter)
    .pipe(plugins.sass({includePaths, indentedSyntax: true}))
    .pipe(sassFilter.restore)
    .pipe(scssFilter)
    .pipe(plugins.sass({includePaths}))
    .pipe(scssFilter.restore)
<% } -%>
<% if (use.crusher) { -%>
    .pipe(builder.crusher.pusher())
<% } -%>
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/styles`))
    .pipe(builder.sync.reloadClient())
})
<% if (use.modernizr) { -%>

gulp.task("build-client-vendor-modernizr", () =>
  builder.modernizr(builder.config.modernizr)
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/modernizr`)),
)
<% } -%>
<% if (use.foundation) { -%>

gulp.task("build-client-vendor-foundation-scripts", () =>
  gulp.src(["foundation.js"], {cwd: "node_modules/foundation-sites/dist/js"})
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/foundation`)),
)

gulp.task("build-client-vendor-foundation-fonts", () =>
  gulp.src(["**/*.{eot,svg,ttf,woff}"], {cwd: "bower_components/foundation-icon-fonts"})
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/foundation/assets/fonts`)),
)
<% } -%>
<% if (use.bootstrap) { -%>
    
gulp.task('build-client-vendor-bootstrap-fonts', () =>
  gulp.src(['**/*'], {cwd: "node_modules/bootstrap-sass/assets/fonts"})
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/bootstrap/assets/fonts`))
)
<% } -%>

gulp.task("nop", () => Promise.resolve())

gulp.task("build-client-vendor-assets", gulp.series(
<% if (use.modernizr) { -%>
    "build-client-vendor-modernizr",
<% } -%>
<% if (use.foundation) { -%>
    "build-client-vendor-foundation-scripts",
    "build-client-vendor-foundation-fonts",
<% } -%>
<% if (use.bootstrap) { -%>
    "build-client-vendor-bootstrap-fonts",
<% } -%>
    "nop"
))

gulp.task("build-test-server-scripts", () => {
  const dest = `${builder.dirs.tgt.serverTest}/scripts`
  return gulp.src(gp.SCRIPT, {cwd: `${builder.dirs.test.scripts}/server`})
    .pipe(builder.plumber())
    .pipe(plugins.newer({dest, map: mapScript}))
    .pipe(plugins.ejs({builder}))
    .pipe(builder.makeScriptPipe(serverTsOptions))
    .pipe(gulp.dest(dest))
    .pipe(builder.mocha.rerunIfWatch())
})

gulp.task("lint-test-server-scripts", () => {
  return gulp.src(gp.SCRIPT, {cwd: `${builder.dirs.test.scripts}/server`})
    .pipe(builder.plumber())
    .pipe(plugins.tslint({
      formatter: "stylish",
    }))
    .pipe(plugins.tslint.report({
      summarizeFailureOutput: true,
    }))
})

gulp.task("build-test-client-bundles", () => {
  const rerunKarma = _.debounce(() => {
    gutil.log("webpack bundle done.")
    builder.karma.rerun()
  }, 1000)
  const opt = {
    entry: [
      path.join(builder.dirs.test.scripts, "client", "*.test.ts"),
      path.join(builder.dirs.src.templates, "**/*.pug"),
    ],
    watch: builder.watchEnabled,
  }
  const dest = `${builder.dirs.tgt.client}/bundles`
  const resultStream = builder.bundler.createStream(opt)
    .pipe(gulp.dest(dest))
    .pipe(plugins.tap((f: any) => {
      // gutil.log('webpack bundle => ', f)
      rerunKarma()
    }))
  if (builder.watchEnabled) {
    return null // stream never ends if watch enabled
  }
  return resultStream
})

gulp.task("pack", (done) => {
  const tar = child_process.spawn("tar", [
    "-czf",
    "dist.tar.gz",
    "package.json",
    "server.js",
    builder.dirs.tgt.root,
  ])
  tar.on("close", (code) => {
    if (code) {
      done(new Error(`tar failed with code ${code}`))
    } else {
      done()
    }
  },
  )
})

gulp.task("serve", () => {
  return builder.server.start()
})

gulp.task("start-sync", () =>
  builder.sync.start(),
)

gulp.task("mocha", () =>
  builder.mocha.start(),
)

gulp.task("karma", async ()  => {
  await builder.karma.start({ singleRun: true })
  await builder.server.stop()
})

gulp.task("karma-watch", () => {
  // don't wait for stop
  builder.karma.start({ singleRun: false })
})

gulp.task("build-server-assets", gulp.series(
  "build-server-templates"
))

gulp.task("build-server", gulp.series(
  "build-server-scripts",
  "lint-server-scripts",
  "build-server-assets",
  "build-server-common"
))

gulp.task("build-client-assets", gulp.series(
  "build-client-images",
  "build-client-styles",
  "build-client-pages",
  "build-client-vendor-assets"
))

gulp.task("build-client", gulp.series(
  "build-client-assets",
  "build-client-bundles"
))

gulp.task("build-test", gulp.series(
  "build-server",
  "build-client-assets",
  "build-test-server-scripts",
  "lint-test-server-scripts",
  "build-test-client-bundles",
))

gulp.task("build", (done) => {
  const tasks = [
    "build-server",
    "build-client",
  ]
  if (builder.config.mode.isProduction) {
    tasks.push("build-starter")
  }
  return gulp.series(...tasks)(done)
})

gulp.task("watch-on", () => {
  builder.watchEnabled = true
  return Promise.resolve()
})

gulp.task("headless-on", () => {
  builder.headlessEnabled = true
  return Promise.resolve()
})
<% if (use.crusher) { -%>

gulp.task("crush-on", () => {
  builder.crusher.enabled = true
  return Promise.resolve()
})
<% } -%>

gulp.task("watch-server-assets", () =>
  gulp.watch([`${builder.dirs.src.templates}/${gp.ALL}`], {}, gulp.series("build-server-templates")),
)

gulp.task("watch-server-scripts", () =>
  gulp.watch([`${builder.dirs.src.scripts}/server/${gp.SCRIPT}`], gulp.series("build-server-scripts", "lint-server-scripts")),
)

gulp.task("watch-server", gulp.series("watch-server-assets", "watch-server-scripts"))

gulp.task("watch-client-assets", () => {
  gulp.watch([`${builder.dirs.src.styles}/${gp.ALL}`], gulp.series("build-client-styles"))
  gulp.watch([`${builder.dirs.src.images}/${gp.ALL}`], gulp.series("build-client-images"))
  gulp.watch([`${builder.dirs.src.pages}/${gp.ALL}`], gulp.series("build-client-pages"))
})

gulp.task("watch-test-server-scripts", () =>
  gulp.watch(
    [`${builder.dirs.test.scripts}/server/${gp.SCRIPT}`],
    gulp.series("build-test-server-scripts", "lint-test-server-scripts")
  ),
)

gulp.task("watch-client", gulp.series("watch-client-assets"))

gulp.task("watch", gulp.series("watch-server", "watch-client"))

gulp.task("watch-test", gulp.series("watch-test-server-scripts"))

gulp.task("run", gulp.series("clean", "build", "serve"))

gulp.task("run-watch", gulp.series("watch-on", "clean", "build", "serve", "start-sync", "watch"))

gulp.task("test", gulp.series(<% if (use.crusher) { %>"crush-on", <% } %>"clean", "build-test", "serve", "mocha", "karma", exitAfter))

gulp.task("test-ci", gulp.series(
  <% if (use.crusher) { %>"crush-on", <% } %>"headless-on", "clean", "build-test",
  "serve", "mocha", "karma",
  exitAfter,
))

gulp.task("test-watch", gulp.series(
  "watch-on", "clean", "build-test", "serve", "mocha", "karma-watch",
  "watch-server", "watch-client-assets", "watch-test"
))

gulp.task("dist", gulp.series(<% if (use.crusher) { %>"crush-on", <% } %>"clean", "build", "pack"))

gulp.task("default", gulp.series("run-watch"))
