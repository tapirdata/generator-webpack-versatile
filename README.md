# generator-browserify-versatile [![Build Status](https://secure.travis-ci.org/tapirdata/generator-browserify-versatile.png?branch=master)](https://travis-ci.org/tapirdata/generator-browserify-versatile)

> [Yeoman](http://yeoman.io) generator to setup an express-project with a bunch of tool (some fixed, some selectable) pre-setup to provide an eligible workflow

## Features

Use [browersify](http://http://browserify.org/) to write client code in [CommonJS](http://en.wikipedia.org/wiki/CommonJS)-format. (That's the same, that is used for server-code.)

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

Usage of tasks will be documented soon... 


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
