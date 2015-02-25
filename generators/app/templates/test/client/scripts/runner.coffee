'use strict'

### global window ###

allTestFiles = []

chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'
chaiJq = require 'chai-jq'
chai.use chaiAsPromised
chai.use chaiJq

module.exports = ->
  window.__karma__.config.testFiles.forEach (file) ->
    mod = file.replace(/\.js$/, '')
    allTestFiles.push './' + mod
    return

  console.log('allTestFiles=', allTestFiles)


  # prepared ->
  #   require allTestFiles, ->
  #     window.__karma__.start()
  #     return
  #   return
  # return
