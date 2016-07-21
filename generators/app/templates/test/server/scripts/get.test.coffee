'use strict'

### global describe, before, it ###
###jshint quotmark: false ###

w = require 'when'
wNode = require 'when/node'
rest = require 'rest'
chai = require 'chai'
chai.use require 'chai-as-promised'
lint = require 'html5-lint'
expect = chai.expect

fetch = (url) ->
  rest url
  .catch (err) ->
    console.error 'FAILED', err
    w.reject new Error "Failed to get '#{url}': #{err.error}"

check = (url) ->
  res = null
  it 'should answer to a request', ->
    resP = fetch url
    .then (_res) -> res = _res; return
    expect(resP).to.be.fulfilled
  it 'should serve the root page', ->
    expect(res.status.code).to.be.equal 200
  it 'should serve some sort of HTML', ->
    expect(res.entity).to.be.contain '<html>'
  it 'should serve valid HTML5', ->
    @timeout 16000
    wNode.call lint, res.entity
    .catch (err) ->
      w.reject new Error 'Failed to lint html: ' + err
    .then (results) ->
      lines = []
      for m in results.messages
        if m.type == 'info'
          continue
        lines.push "[#{m.type}] line #{m.lastLine}:"
        lines.push "#{m.extract}"
        lines.push "#cause: #{m.message}"
      if lines.length > 0
        w.reject new Error "Bad html at '#{url}'\n" + lines.join '\n'
  return

config = require 'config'

describe 'The Server', ->
  before ->
  check "http://localhost:#{config.server.port}/"
return
