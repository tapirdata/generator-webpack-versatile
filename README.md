# generator-webpack-versatile

[![npm version](https://img.shields.io/npm/v/generator-webpack-versatile.svg?style=flat-square)](https://www.npmjs.com/package/generator-webpack-versatile)
[![Build Status](https://secure.travis-ci.org/tapirdata/generator-webpack-versatile.png?branch=master)](https://travis-ci.org/tapirdata/generator-webpack-versatile)
[![Dependency Status](https://david-dm.org/tapirdata/generator-webpack-versatile.svg)](https://david-dm.org/tapirdata/generator-webpack-versatile)
[![devDependency Status](https://david-dm.org/tapirdata/generator-webpack-versatile/dev-status.svg)](https://david-dm.org/tapirdata/generator-webpack-versatile#info=devDependencies)

> [Yeoman](http://yeoman.io) generator will setup an express-project with a bunch of tools (some fixed, some selectable) pre-setup to provide an eligible work flow.

## Features

Use [webpack](http://webpack.github.io/) to write client code as ES2015 modules or in [CommonJS](http://en.wikipedia.org/wiki/CommonJS)-format.

Use [browersync](http://www.browsersync.io/) for fast live testing on multiple devices. 

Use [babel](http://babeljs.io/) to transpile ES2015.

Use [gulp](http://gulpjs.com/) for all task automation.

Use [pug](http://pug-js.org) for server and client templating.

Use [karma](http://karma-runner.github.io/0.12/index.html) for client-tests. There is also support for smoke-testing your application - either in your installed browsers or
headlessly using [PhantomJS](http://phantomjs.org/).

Use [mocha](http://mochajs.org/) with [chai](http://chaijs.com/) for unit-tests.

### Optionally

Use [modernizr](http://modernizr.com/) for browser-feature detection.

Use [foundation](http://foundation.zurb.com/) or [bootstrap](http://getbootstrap.com/) for responsive client-side styling.   

Use [backbone](http://backbonejs.org/) as a lightweight client-library to build agile single-page web applications.

Use [marionette](http://marionettejs.com/) to organize your backbone views.

Use [sass](http://sass-lang.com/) as versatile CSS-Preprocessor (required for bootstrap and foundation).

Use [cache-crusher](https://www.npmjs.com/package/cache-crusher) to provide cache-busting for your production-build.


## Usage

The following additional npm-packages are assumed to be installed globally: *bower*, *gulp*, *yo*.

```bash
$ npm install -g bower gulp yo generator-webpack-versatile
```

Finally, initiate the generator:

```bash
$ yo webpack-versatile
```

## Generators

### App

Just select your preferred options and wait till your project has been scaffolded...

Look in the generated file `README.md` for details of project layout and usage of gulp tasks. 

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
