This project was created by [generator-webpack-versatile](https://www.npmjs.com/package/generator-webpack-versatile).

## Layout of this Project

### `<%= dirs.src %>/`:
- `images/`: static image-files
- `pages/`: static html-pages
- `scripts/`:
  - `client/`: client-side script files
    - `app-starter.js`: the client-side entry-point
<% if (use.backbone) { -%>
    - `views/`: Backbone/Marionette views
<% } -%>
  - `server/`: server-side script files
  - `starter/server.js`: the server-sided entry-point for target *production*
- `styles/`: style-sheets (.sass, .scss, .css)
- `templates/`: pug-templates to be rendered server or client sided

### `config/`

Config files to setup paths and options

### `<%= dirs.tmpDev %>/`, `<%= dirs.tmpTest %>/`, `<%= dirs.dist %>/`:

Projects are built here for targets *development*, *testing*, *production*.

### `builder/`

Helper scripts to be used by `gulpfile`

### `test/`

Server and client test files

### `<%= dirs.tmpTest %>/test-results/`

Test results

## Gulp Tasks

All gulp tasks can be used for different targets: *development*, *testing*, *production*.
The target is mainly used for selecting build directory and server port via the relevant
config files in `./config/`. The target can be selected via the environment variable `NODE_ENV`
or the command line arg `--env` (which takes precedence), default: *development*.

Some useful top-level tasks:

```bash
$ gulp run-watch
```
cleans the target-tree, builds the application, runs server application and runs client part
in local browsers. Then it keeps watching for file-changes, does necessary rebuild, and
eventually - if needed - restarts server restart and reloads client data.

```bash
$ gulp --env test test-watch
```
cleans the target-tree, builds the application, runs server application and runs server-
and client-tests in local browsers. Then it keeps watching for file-changes, does necessary rebuild, and
eventually - if needed - restarts server restart and re-runs tests.

```bash
$ gulp --env test test-ci
```
cleans the target-tree, builds the application, runs server application and runs server-
and client-test headlessly using PhantomJS. Test-results are written into `test-results.xml`.
This task is also used by `webpack-versatile`'s self-tests.

```bash
$ gulp --env prod dist
```
cleans the target-tree, builds the application for production (uglified and – if cache-crusher is included – cache-busted), packs files into an archive `dist.tar.gz`,
which can be unpacked in your production directory. There, after installing node packages with

```bash
$ npm install --production
```

You can start your app, using:

```bash
$ npm start
```



