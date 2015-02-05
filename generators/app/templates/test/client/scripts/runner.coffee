'use strict'

### global define, window ###

define [ 'require' ], (require) ->
  allTestFiles = []
  # console.log('window.__karma__.config=', window.__karma__.config);

  prepared = (cb) ->
    require [
      'poly'
      'chai'
      'chaiAsPromised'
      'chaiJq'
    ], (poly, chai, chaiAsPromised, chaiJq) ->
      chai.use chaiAsPromised
      chai.use chaiJq
      cb()
      return
    return

  window.__karma__.config.testFiles.forEach (file) ->
    mod = file.replace(/\.js$/, '')
    allTestFiles.push './' + mod
    return
  # console.log('allTestFiles=', allTestFiles);
  ->
    prepared ->
      require allTestFiles, ->
        window.__karma__.start()
        return
      return
    return
