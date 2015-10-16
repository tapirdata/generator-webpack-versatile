'use strict'

### global window ###
###jshint quotmark: false ###

require 'es5-shim'
_              = require 'lodash'
$              = require 'jquery'
w              = require 'when'
chai           = require 'chai'
chai.use require 'chai-as-promised'
chai.use require 'chai-jq'


class Gasper
  constructor: (options) ->
    @switchFast = options.switchFast
    @headFilter = options.headFilter
    @bodyFilter = options.bodyFilter
    @app = null

  splitHtml: (html) ->
    html = html
    .replace /<(html|head|body)>/g, '<div class="_$1_">'
    .replace /<\/(html|head|body)>/g, '</div>'
    $html = $ html
    $head: $html.find 'div._head_'
    $body: $html.find 'div._body_'

  gaspHtml: (html) ->
    options = options or {}
    headFilter = options.headFilter
    bodyFilter = options.bodyFilter

    hs = @splitHtml(html)

    # $('head').html hs.$head.contents()
    filter = @headFilter
    $('head').html ''
    # $('head').children(':not([class])')
    #   .remove() # leave <meta class=...> for foundation
    hs.$head.children().each ->
      $this = $ @
      if not filter or filter $this
        $('head').append $this

    # $('body').html hs.$body.contents()
    filter = @bodyFilter
    $('body').html ''
    hs.$body.children().each ->
      $this = $ @
      if not filter or filter $this
        $('body').append $this
    return
      
  show: (location, fast) ->
    # console.log 'show', location, fast
    if fast
      window.location = location
      w()
    else
      w($.get location)
      .then (html) =>
        # console.log 'show html=', html
        @gaspHtml html
        app = @app
        if app
          app.amendPage()
            .then ->
              app.instrumentPage()

  switch: (location) ->
    @show location, @switchFast

  activate: ($a) ->
    @switch $a.attr('href')


  retry: (grace, steps, fn) ->
    
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



module.exports = Gasper




