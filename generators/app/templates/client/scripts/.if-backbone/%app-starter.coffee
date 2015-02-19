'use strict'

### global define ###

define [ './router' ], (Router) ->
  app =
    initialize: ->
      console.log 'app.initialize'
      new Router(app: this)
      return
    title: '<%= _.capitalize(appname) %>'

  ->
    app.initialize()
    app
