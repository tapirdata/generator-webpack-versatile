# generator-browserify-versatile [![Build Status](https://secure.travis-ci.org/tapirdata/generator-browserify-versatile.png?branch=master)](https://travis-ci.org/tapirdata/generator-browserify-versatile) [![Dependency Status](https://david-dm.org/tapirdata/generator-browserify-versatile.svg)](https://david-dm.org/tapirdata/generator-browserify-versatile) [![devDependency Status](https://david-dm.org/tapirdata/generator-browserify-versatile/dev-status.svg)](https://david-dm.org/tapirdata/generator-browserify-versatile#info=devDependencies)
> [Yeoman](http://yeoman.io) generator to setup an express-project with a bunch of tool (some fixed, some selectable) pre-setup to provide an eligible workflow

## Features

Use [browersify](http://http://browserify.org/) to write client code in [CommonJS](http://en.wikipedia.org/wiki/CommonJS)-format. (That's the same, that is used for server-code.)

Use [browersync](http://www.browsersync.io/) for fast live testing on multiple devices. 

Use [gulp](http://gulpjs.com/) for all task automation.

Use [jade](http://jade-lang.com/) for server and client templating.

Use [karma](http://karma-runner.github.io/0.12/index.html) for client-tests. There is also support for smoke-testing your application - either in your installed browsers or
headlessly using [PhantomJS](http://phantomjs.org/).

Use [mocha](http://mochajs.org/) with [chai](http://chaijs.com/) for unit-tests.

### Optionally

Use [backbone](http://backbonejs.org/) as a lightweight client-library to build agile single-page web applications.

Use [bootstrap](http://getbootstrap.com/) for easy client-side styling.  

Use [coffeescript](http://coffeescript.org/) or just plain Javascript for your project-code.

Use [modernizr](http://modernizr.com/) for browser-feature detection.

Use [sass](http://sass-lang.com/) as versatile CSS-Preprocessor (required for bootstrap).

## Usage

```bash
$ npm install -g generator-browserify-versatile
```

The following npm-packages are assumed to be installed globally: *bower*, *gulp*, *yo*.

Finally, initiate the generator:

```bash
$ yo browserify-versatile
```

## Generators

### App

Just select your preferred options and wait till your project has been scaffolded...

All gulp tasks can be used for different targets: *development*, *testing*, *production*.
The target is mainly used for selecting build directory and server port via the relevant
config files in `./config/`. The target can be selected via the environment variable `NODE_ENV`
or the commandline arg `--env` (which takes precedence), default: *development*.

Some usefull top-level tasks:

```bash
$ gulp run-watch
```
cleans the target-tree, builds the application, runs server application and runs client part
in local browsers. Then it keeps watching for file-changes, does neccessary rebuild, and
eventually - if needed - restarts server restart and reloads client data.

```bash
$ gulp --env test test-watch
```
cleans the target-tree, builds the application, runs server application and runs server-
and client-tests in local browsers. Then it keeps watching for file-changes, does neccessary rebuild, and
eventually - if needed - restarts server restart and re-runs tests.

```bash
$ gulp --env test test-ci
```
cleans the target-tree, builds the application, runs server application and runs server-
and client-test headlessly using PhantonJS. Test-results are written into `test-results.xml`.
This task is also used by `browserify-versatiles` self-tests.

```bash
$ gulp --env prod dist
```
cleans the target-tree, builds the application for production, packs files into an archive `dist.tar.gz`,
which can be unpacked in your production directory. There, after installing node packages with

```bash
$ npm install --production
```

you can start your app, using:

```bash
$ npm start
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
