'use strict'

### global describe, before, it ###
###jshint quotmark: false ###

fetch = require 'node-fetch'
chai = require 'chai'
chai.use require 'chai-as-promised'
lint = require 'html5-lint'
expect = chai.expect


check = (url) ->
  res = null
  text = null
  it 'should answer to a request', ->
    fetch url
    .then (_res) ->
      res = _res
      return
  it 'should serve the root page', ->
    expect res.status
    .to.be.equal 200
  it 'should serve some sort of HTML', ->
    expect res.text().then (_text) ->
      text = _text
      _text
    .to.eventually.contain '<html>'
  it 'should serve valid HTML5', ->
    @timeout 16000
    new Promise (resolve, reject) ->
      lint text, (err, results) ->
        if (err)
          reject new Error 'Failed to lint html: ' + err
          return
        lines = []
        for m in results.messages
          if m.type == 'info'
            continue
          lines.push "[#{m.type}] line #{m.lastLine}:"
          lines.push "#{m.extract}"
          lines.push "#cause: #{m.message}"
        if lines.length > 0
          reject new Error "Bad html at '#{url}'\n" + lines.join '\n'
        else
          resolve()
        return


config = require 'config'

describe 'The Server', ->
  before ->
  check "http://localhost:#{config.server.port}/"
return
