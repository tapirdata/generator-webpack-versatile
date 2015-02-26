'use strict'

### global window ###
###jshint quotmark: false ###

_              = require 'lodash'
$              = require 'jquery'
w              = require 'when'
chai           = require 'chai'
chai.use require 'chai-as-promised'
chai.use require 'chai-jq'

exports.activateLink = ($a) ->
  window.location = $a.attr('href')
  return

exports.retry = (grace, steps, fn) ->
  
  _retry = (dt, left, wrappedFn) ->
    result = wrappedFn()
    if left <= 0
      result
    else
      result
      .catch ->
        w()
        .delay dt
        .then ->
          _retry dt, left - 1, wrappedFn

  if typeof steps == 'function'
    fn = steps
    steps = 10
  else if typeof grace == 'function'
    fn =  grace
    steps = 10
    grace = 1000
  _retry grace / steps, steps, w.lift(fn)


exports.splitHtml = (html) ->
  html = html
  .replace /<(html|head|body)>/g, '<div class="_$1_">'
  .replace /<\/(html|head|body)>/g, '</div>'
  $html = $ html
  $head: $html.find 'div._head_'
  $body: $html.find 'div._body_'


exports.gaspHtml = (html, options) ->
  options = options or {}
  headFilter = options.headFilter
  bodyFilter = options.bodyFilter

  h = exports.splitHtml(html)
  h.$head.children().each ->
    $child = $ this
    if not headFilter or headFilter($child)
      $('head').append $child
  h.$body.children().each ->
    $child = $ this
    if not bodyFilter or bodyFilter($child)
      $('body').append $child
