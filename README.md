# generator-browserify-versatile [![Build Status](https://secure.travis-ci.org/tapirdata/generator-browserify-versatile.png?branch=master)](https://travis-ci.org/tapirdata/generator-browserify-versatile) [![Dependency Status](https://david-dm.org/tapirdata/generator-browserify-versatile.svg)](https://david-dm.org/tapirdata/generator-browserify-versatile) [![devDependency Status](https://david-dm.org/tapirdata/generator-browserify-versatile/dev-status.svg)](https://david-dm.org/tapirdata/generator-browserify-versatile#info=devDependencies)
> [Yeoman](http://yeoman.io) generator will setup an express-project with a bunch of tools (some fixed, some selectable) pre-setup to provide an eligible work flow.

## Features

Use [browersify](http://browserify.org/) to write client code in [CommonJS](http://en.wikipedia.org/wiki/CommonJS)-format. (That's the same, that is used for server-code.)

Use [browersync](http://www.browsersync.io/) for fast live testing on multiple devices. 

Use [gulp](http://gulpjs.com/) for all task automation.

Use [jade](http://jade-lang.com/) for server and client templating.

Use [karma](http://karma-runner.github.io/0.12/index.html) for client-tests. There is also support for smoke-testing your application - either in your installed browsers or
headlessly using [PhantomJS](http://phantomjs.org/).

Use [mocha](http://mochajs.org/) with [chai](http://chaijs.com/) for unit-tests.

### Optionally

Use [modernizr](http://modernizr.com/) for browser-feature detection.

Use [foundation](http://foundation.zurb.com/) or [bootstrap](http://getbootstrap.com/) for responsive client-side styling.   

Use [backbone](http://backbonejs.org/) as a lightweight client-library to build agile single-page web applications.

Use [marionette](http://marionettejs.com/) to organize your backbone views.

Use [coffeescript](http://coffeescript.org/) or just plain Javascript for your project-code.

Use [sass](http://sass-lang.com/) as versatile CSS-Preprocessor (required for bootstrap and foundation).

Use [cache-crusher](https://www.npmjs.com/package/cache-crusher) to provide cache-busting for your production-build.


## Usage

The following additional npm-packages are assumed to be installed globally: *bower*, *gulp*, *yo*, *coffee-script*.

```bash
$ npm install -g bower gulp yo coffee-script generator-browserify-versatile
```

Finally, initiate the generator:

```bash
$ yo browserify-versatile
```

## Generators

### App

Just select your preferred options and wait till your project has been scaffolded...

Look in the generated file `README.md` for details of project layout and usage of gulp tasks. 

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
