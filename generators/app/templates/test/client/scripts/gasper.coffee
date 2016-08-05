'use strict'

### global window ###
###jshint quotmark: false ###

_              = require 'lodash'
$              = require 'jquery'
chai           = require 'chai'
chai.use require 'chai-as-promised'
chai.use require 'chai-jq'

lift = (fn) ->
  ->
    self = @
    args = arguments
    Promise.resolve()
      .then ->
        fn.apply self, args


delay = (duration) ->
  ->
    new Promise((resolve) ->
      window.setTimeout resolve, duration
      return
    )


class Gasper
  constructor: (options) ->
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

    $('head').html ''
    $('body').html ''

    filter = @headFilter
    hs.$head.children().each ->
      $this = $ @
      if not filter or filter $this
        $('head').append $this

    # $('body').html hs.$body.contents()
    filter = @bodyFilter
    hs.$body.children().each ->
      $this = $ @
      if not filter or filter $this
        $('body').append $this
    return
      
  show: (location) ->
    if location[0] == '#'
      window.location = location
      Promise.resolve()
    else
      $.get location
      .then (html) =>
        # console.log 'show html=', html
        @gaspHtml html
        app = @app
        if app
          app.amendPage()
            .then ->
              app.instrumentPage()

  switch: (location) ->
    @show location

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
          Promise.resolve()
          .then delay dt
          .then ->
            _retry dt, left - 1, wrappedFn

    if typeof steps == 'function'
      fn = steps
      steps = 10
    else if typeof grace == 'function'
      fn =  grace
      steps = 10
      grace = 1000
    _retry grace / steps, steps, lift fn


  delay: delay



module.exports = Gasper




