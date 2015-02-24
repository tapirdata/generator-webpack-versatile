'use strict'
util = require('util')
path = require('path')
yosay = require('yosay')
chalk = require('chalk')
_ = require('lodash')

BaseGenerator = require('../lib/base')
ExpressDevelopGenerator = BaseGenerator.extend(
  constructor: ->
    BaseGenerator.apply this, arguments
    return
  prompting: askFor: ->
    done = @async()
    config = @config
    use = config.get('use')
    if !@options['skip-welcome-message']
      # Have Yeoman greet the user.
      @log yosay('Welcome to the marvelous ExpressDevelop generator!')
    prompts = [
      {
        type: 'checkbox'
        name: 'features'
        message: 'What more would you like?'
        choices: [
          {
            name: 'Backbone'
            value: 'backbone'
            checked: use.backbone
          }
          {
            name: 'Bootstrap'
            value: 'bootstrap'
            checked: use.bootstrap
          }
          {
            name: 'Modernizr'
            value: 'modernizr'
            checked: use.modernizr
          }
          {
            name: 'Sass'
            value: 'sass'
            checked: !!use.sass
          }
          {
            name: 'Coffee'
            value: 'coffee'
            checked: use.coffee
          }
        ]
      }
      # {
      #   name: 'amdLib'
      #   message: 'What AMD-Library would you like to use?'
      #   type: 'list'
      #   choices: [
      #     'curl'
      #     'requirejs'
      #   ]
      #   default: if use.amd == 'requirejs' then 1 else 0
      # }
    ]
    @prompt prompts, ((answers) ->

      hasFeature = (feat) ->
        answers.features.indexOf(feat) != -1

      # console.log 'answers=', answers
      use.bootstrap = hasFeature('bootstrap')
      use.modernizr = hasFeature('modernizr')
      use.backbone = hasFeature('backbone')
      use.sass = hasFeature('sass')
      use.coffee = hasFeature('coffee')
      # use.amd = if answers.amdLib == 'requirejs' then 'requirejs' else 'curl'
      config.set 'use', use
      done()
      return
    ).bind(this)
    return
  configuring: saveConfig: ->
    @config.set @settings
    @config.save()
    return
  writing:
    projectFiles: ->
      console.log 'copy project files'
      @_branchCopy 'root'
      return
    serverFiles: ->
      console.log 'copy server files'
      dirs = @config.get('dirs')
      @_branchCopy 'server', dirs.serverSrc
      return
    clientfiles: ->
      console.log 'copy client files'
      dirs = @config.get('dirs')
      @_branchCopy 'client', dirs.clientSrc
      return
    testfiles: ->
      console.log 'copy test files'
      dirs = @config.get('dirs')
      @_branchCopy 'test', dirs.test
      return
  install: ->
    if !@options['skip-install']
      @installDependencies()
    return
)
module.exports = ExpressDevelopGenerator
