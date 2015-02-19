'use strict'

### global define ###

define [], ->
  app =
    initialize: ->
      console.log 'app.initialize'
      return
  ->
    app.initialize()
    app
