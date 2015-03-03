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
    wNode.call lint, res.entity
    .catch (err) ->
      w.reject new Error 'Failed to lint html: ' + err
    .then (results) ->
      messages = results.messages
      if messages.length
        lines = [
         "Bad html at '#{url}'"
        ]
        messages.forEach (m) ->
          lines = lines.concat [
            "[#{m.type}] line #{m.lastLine}:"
            "#{m.extract}"
            "#cause: #{m.message}"
          ]
          return
        w.reject new Error lines.join '\n'
  return

describe 'The Server', ->
  before ->
  check 'http://localhost:9876/'
return
