'use strict'

### global window ###
### jshint quotmark: false ###

w = require 'when'

activateLink = ($a) ->
  window.location = $a.attr('href')
  return

retry = (grace, steps, fn) ->
  
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

module.exports =
  activateLink: activateLink
  retry: retry




