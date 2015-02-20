'use strict'
#
### global define, window ###
### jshint quotmark: false ###

define ['when'], (w) ->

  $at = ($els, n) ->
    $els.slice(n, n + 1)

  activateLink = ($a) ->
    window.location = $a.attr('href')
    return

  retry = (grace, left, fn) ->
    
    _retry = (dt, left, wrappedFn) ->
      # console.log '_retry', dt, left
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

    if typeof left == 'function'
      fn = left
      left = 10
    else if typeof grace == 'function'
      fn =  grace
      left = 10
      grace = 1000
    _retry grace / left, left, w.lift(fn)

  $at: $at
  activateLink: activateLink
  retry: retry




