
import path from 'path';
import del from 'del';
import glob from 'glob';
import gulp from 'gulp';
import gutil from 'gulp-util';
import pluginsFactory from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import lazypipe from 'lazypipe';
import child_process from 'child_process';
import builder from './builder';


function exitAfter(done) {
  return function(err) {
    done(err);
    process.exit();
  };
}

const plugins = pluginsFactory();
const gp = builder.globPatterns;

function mapScript(p) {
  return  gutil.replaceExtension(p, '.js');
}

let makeScriptPipe = function() {
  let jsFilter = plugins.filter([gp.JS], {restore: true});
  let lp = lazypipe()
    .pipe(() => jsFilter)
    .pipe(plugins.eslint)
    .pipe(plugins.eslint.format)
    .pipe(plugins.babel, {
      presets: ['es2015', 'stage-3'],
      plugins: ['transform-runtime'],
    })

    .pipe(() => jsFilter.restore);
  return lp();
};

gulp.task('clean', done => del(builder.dirs.tgt.root, done)
);

gulp.task('build-server-scripts', function() {
  let dest = `${builder.dirs.tgt.server}/scripts`;
  return gulp.src(gp.SCRIPT, {cwd: `${builder.dirs.src.server}/scripts`})
    .pipe(builder.plumber())
    .pipe(plugins.newer({dest, map: mapScript}))
    .pipe(makeScriptPipe())
    .pipe(gulp.dest(dest))
    .pipe(builder.sync.reloadServer())
    .pipe(builder.mocha.rerunIfWatch());
});

gulp.task('build-server-templates', function() {
  let dest = `${builder.dirs.tgt.server}/templates`;
  return gulp.src([gp.PUG], {cwd: `${builder.dirs.src.server}/templates`})
    .pipe(builder.plumber())
    .pipe(plugins.newer({dest}))
    .pipe(plugins.ejs({builder}))
<% if (use.crusher) { -%>
    .pipe(builder.crusher.puller())
<% } -%>
    .pipe(gulp.dest(dest))
    .pipe(builder.sync.reloadServer())
    .pipe(builder.mocha.rerunIfWatch());
});

gulp.task('build-server-config', function() {
  let dest = `${builder.dirs.tgt.server}/config`;
  return gulp.src([gp.ALL], {cwd: `${builder.dirs.src.server}/config`})
    .pipe(builder.plumber())
    .pipe(plugins.ejs({builder}))
    .pipe(makeScriptPipe())
    .pipe(gulp.dest(dest));
});

gulp.task('build-starter', function() {
  let dest = __dirname;
  return gulp.src(gp.SCRIPT, {cwd: `${builder.dirs.src.server}/starter`})
    .pipe(builder.plumber())
    .pipe(plugins.ejs({builder}))
    .pipe(makeScriptPipe())
    .pipe(gulp.dest(dest));
});

gulp.task('build-client-bundles', () => {
  let opt = {
    entry: path.join(builder.dirs.src.client, 'scripts', 'main.js'),
    uglify: builder.config.mode.isProduction,
  };
  if (builder.watchEnabled) {
    return builder.bundler.startDevServer(opt);
  } else {
    let dest = `${builder.dirs.tgt.client}/bundles`;
    return builder.bundler.createStream(opt)
      .pipe(gulp.dest(dest));
  }
});

gulp.task('build-client-images', () =>
  gulp.src([gp.ALL], {cwd: `${builder.dirs.src.client}/images`})
    .pipe(builder.plumber())<% if (use.crusher) { %>
    .pipe(builder.crusher.pusher())<% } %>
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/images`))
    .pipe(builder.sync.reloadClient())
);

gulp.task('build-client-pages', () =>
  gulp.src([gp.ALL], {cwd: `${builder.dirs.src.client}/pages`})
    .pipe(builder.plumber())
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/pages`))
    .pipe(builder.sync.reloadClient())
);

gulp.task('build-client-styles', function() {
  let templateConfig = {};<% if (use.sass) { %>
  let includePaths = [];<% if (use.bootstrap) { %>
  templateConfig.bootstrapSassPath = 'node_modules/bootstrap-sass/assets/stylesheets';
  templateConfig.bootstrapSassMain = templateConfig.bootstrapSassPath + '/' + '_bootstrap.scss';<% } if (use.foundation) { %>
  templateConfig.foundationSassPath = 'node_modules/foundation-sites/scss';
  templateConfig.foundationSassMain = templateConfig.foundationSassPath + '/' + 'foundation.scss';
  includePaths.push(templateConfig.foundationSassPath);<% } %>
  let sassFilter = plugins.filter([gp.SASS], {restore: true});
  let scssFilter = plugins.filter([gp.SCSS], {restore: true});<% } %>
  return gulp.src([gp.CSS<% if (use.sass) { %>, gp.SASS, gp.SCSS<% } %>], {cwd: `${builder.dirs.src.client}/styles`})
    .pipe(builder.plumber())
    .pipe(plugins.ejs(templateConfig))<% if (use.sass) { %>
    .pipe(sassFilter)
    .pipe(plugins.sass({includePaths, indentedSyntax: true}))
    .pipe(sassFilter.restore)
    .pipe(scssFilter)
    .pipe(plugins.sass({includePaths}))
    .pipe(scssFilter.restore)<% } if (use.crusher) { %>
    .pipe(builder.crusher.pusher())<% } %>
    .pipe(gulp.dest(`${builder.dirs.tgt.client}/styles`))
    .pipe(builder.sync.reloadClient());
});

<% if (use.modernizr) { -%>
gulp.task('build-client-vendor-modernizr', () =>
  builder.modernizr(builder.config.modernizr)
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/modernizr`))

);
<% } -%>

<% if (use.foundation) { -%>
gulp.task('build-client-vendor-foundation-scripts', () =>
  gulp.src(['foundation.js'], {cwd: 'node_modules/foundation-sites/dist'})
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/foundation`))
);

gulp.task('build-client-vendor-foundation-fonts', () =>
  gulp.src(['**/*.{eot,svg,ttf,woff}'], {cwd: '<%= dirs.bower %>/foundation-icon-fonts'})
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/foundation/assets/fonts`))
);
<% } -%>

<% if (use.bootstrap) { -%>
gulp.task('build-client-vendor-bootstrap-fonts', () =>
  gulp.src(['**/*'], {cwd: 'node_modules/bootstrap-sass/assets/fonts'})
    .pipe(gulp.dest(`${builder.dirs.tgt.clientVendor}/bootstrap/assets/fonts`))
);
<% } -%>


gulp.task('nop', function() {});

gulp.task('build-client-vendor-assets', done =>
  runSequence([<% if (use.modernizr) { %>
    'build-client-vendor-modernizr',<% } %><% if (use.foundation) { %>
    'build-client-vendor-foundation-scripts',
    'build-client-vendor-foundation-fonts',<% } %><% if (use.bootstrap) { %>
    'build-client-vendor-bootstrap-fonts',<% } %>
    'nop'
  ], done)
);

gulp.task('build-test-server-scripts', function() {
  let dest = `${builder.dirs.tgt.serverTest}/scripts`;
  return gulp.src(gp.SCRIPT, {cwd: `${builder.dirs.test.server}/scripts`})
    .pipe(builder.plumber())
    .pipe(plugins.newer({dest, map: mapScript}))
    .pipe(plugins.ejs({builder}))
    .pipe(makeScriptPipe())
    .pipe(gulp.dest(dest))
    .pipe(builder.mocha.rerunIfWatch());
});

gulp.task('build-test-client-bundles', () => {
  let opt = {
    entry: glob.sync(path.join(builder.dirs.test.client, 'scripts', '*.test.js')),
    watch: builder.watchEnabled,
  };
  let dest = `${builder.dirs.tgt.client}/bundles`;
  let bundleStream = builder.bundler.createStream(opt, (err) => {
    gutil.log('webpack bundle done.%s', err === null ? '' : ' ERROR: ' + err);
    builder.karma.rerun();
  });
  let result = bundleStream
    .pipe(gulp.dest(dest));
  if (!builder.watchEnabled) {
    return result;
  }
});

gulp.task('pack', function(done) {
  let tar = child_process.spawn('tar', [
    '-czf',
    'dist.tar.gz',
    'package.json',
    'server.js',
    builder.dirs.tgt.root
  ]);
  tar.on('close', function(code) {
    if (code) {
      done(new Error(`tar failed with code ${code}`));
    } else {
      done();
    }
  }
  );
});

gulp.task('serve', () => {
  return builder.server.start();
});

gulp.task('start-sync', () =>
  builder.sync.start()
);

gulp.task('mocha', () =>
  builder.mocha.start()
);

gulp.task('karma', ()  =>
  builder.karma.start({singleRun: true})
    .then(() =>
      builder.server.stop()
    )
);

gulp.task('karma-watch', () => {
  // don't wait for stop
  builder.karma.start({singleRun: false});
});


gulp.task('build-server-assets', done =>
  runSequence([
    'build-server-templates'
  ], done)
);

gulp.task('build-server', done =>
  runSequence([
    'build-server-scripts',
    'build-server-assets',
    'build-server-config'
  ], done)
);

gulp.task('build-client-assets', done =>
  runSequence([
    'build-client-images',
    'build-client-styles',
    'build-client-pages',
    'build-client-vendor-assets'
  ], done)
);

gulp.task('build-client', done =>
  runSequence([
    'build-client-assets',
    'build-client-bundles'
  ], done)
);

gulp.task('build-test', done =>
  runSequence([
    'build-server',
    'build-client-assets',
    'build-test-server-scripts',
    'build-test-client-bundles'
  ], done)
);

gulp.task('build', function(done) {
  let tasks = [
    'build-server',
    'build-client'
  ];
  if (builder.config.mode.isProduction) {
    tasks.push('build-starter');
  }
  return runSequence(tasks, done);
});


gulp.task('watch-on', () =>
  builder.watchEnabled = true
);

gulp.task('headless-on', () =>
  builder.headlessEnabled = true
);

<% if (use.crusher) { -%>
gulp.task('crush-on', () =>
  builder.crusher.enabled = true
);
<% } -%>

gulp.task('watch-server-assets', () =>
  gulp.watch([`${builder.dirs.src.server}/templates/${gp.ALL}`], ['build-server-templates'])
);

gulp.task('watch-server-scripts', () =>
  gulp.watch([`${builder.dirs.src.server}/scripts/${gp.SCRIPT}`], ['build-server-scripts'])
);

gulp.task('watch-server', ['watch-server-assets', 'watch-server-scripts']);

gulp.task('watch-client-assets', () => {
  gulp.watch([`${builder.dirs.src.client}/styles/${gp.ALL}`], ['build-client-styles']);
  gulp.watch([`${builder.dirs.src.client}/images/${gp.ALL}`], ['build-client-images']);
  gulp.watch([`${builder.dirs.src.client}/pages/${gp.ALL}`], ['build-client-pages']);
});

gulp.task('watch-test-server-scripts', () =>
    gulp.watch([`${builder.dirs.test.server}/scripts/${gp.SCRIPT}`], ['build-test-server-scripts'])
);

gulp.task('watch-client', ['watch-client-assets']);

gulp.task('watch', ['watch-server', 'watch-client']);

gulp.task('watch-test', ['watch-test-server-scripts']);

gulp.task('run', done => runSequence('clean', 'build', 'serve', done)
);

gulp.task('run-watch', done => runSequence('watch-on', 'clean', 'build', 'serve', 'start-sync', 'watch', done)
);

gulp.task('test', done =>
  runSequence(<% if (use.crusher) { %>'crush-on', <% } %>'clean', 'build-test', 'serve', 'mocha', 'karma',
    exitAfter(done))
);

gulp.task('test-ci', done => runSequence(
      <% if (use.crusher) { %>'crush-on', <% } %>'headless-on', 'clean', 'build-test',
      'serve', 'mocha', 'karma',
      exitAfter(done))
);

gulp.task('test-watch', done => runSequence(
      'watch-on', 'clean', 'build-test', 'serve', 'mocha', 'karma-watch',
      'watch-server', 'watch-client-assets', 'watch-test',
      done)
);

gulp.task('dist', done => runSequence(<% if (use.crusher) { %>'crush-on', <% } %>'clean', 'build', 'pack', done)
);

gulp.task('default', ['run-watch']);

