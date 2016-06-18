'use strict'
util = require 'util' 
path = require 'path' 
yosay = require 'yosay' 
chalk = require 'chalk' 
_ = require 'lodash' 

BaseGenerator = require '../lib/base'

ExpressDevelopGenerator = BaseGenerator.extend

  constructor: ->
    BaseGenerator.apply @, arguments
    return

  prompting:
    askFor: ->
      config = @config
      use = config.get('use')
      if !@options['skip-welcome-message']
        # Have Yeoman greet the user.
        @log yosay 'Welcome to the marvelous ExpressDevelop generator!'
      prompts = [
        {
          type: 'checkbox'
          name: 'features'
          message: 'What more would you like?'
          choices: [
            {
              name: 'Modernizr'
              value: 'modernizr'
              checked: use.modernizr
            }
            {
              name: 'Foundation'
              value: 'foundation'
              checked: use.foundation
            }
            {
              name: 'Bootstrap'
              value: 'bootstrap'
              checked: use.bootstrap
            }
            {
              name: 'Backbone'
              value: 'backbone'
              checked: use.backbone
            }
            {
              name: 'Coffee'
              value: 'coffee'
              checked: use.coffee
            }
            {
              name: 'Sass'
              value: 'sass'
              checked: use.sass
            }
            {
              name: 'Cache-crusher'
              value: 'crusher'
              checked: use.crusher
            }
          ]
        }
      ]
      # console.log "prompts=#{JSON.stringify(prompts)}"
      @prompt prompts
        .then (answers) =>
          hasFeature = (feat) ->
            answers.features.indexOf(feat) != -1

          # console.log "answers=#{JSON.stringify(answers)}"
          use.modernizr = hasFeature 'modernizr'
          use.foundation = hasFeature 'foundation'
          use.bootstrap = hasFeature 'bootstrap'
          use.backbone = hasFeature 'backbone'
          use.sass = hasFeature 'sass'
          use.coffee = hasFeature 'coffee'
          use.crusher = hasFeature 'crusher'
          config.set 'use', use

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
      dirs = @config.get 'dirs'
      @_branchCopy 'server', dirs.serverSrc
      return
    clientfiles: ->
      console.log 'copy client files'
      dirs = @config.get 'dirs' 
      @_branchCopy 'client', dirs.clientSrc
      return
    testfiles: ->
      console.log 'copy test files'
      dirs = @config.get 'dirs' 
      @_branchCopy 'test', dirs.test
      return
  install: ->
    if !@options['skip-install']
      @installDependencies()
    return
 
module.exports = ExpressDevelopGenerator
