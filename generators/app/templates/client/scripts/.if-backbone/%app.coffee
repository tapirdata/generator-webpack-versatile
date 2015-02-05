'use strict'

### global define ###

define [ './router' ], (Router) ->
  App = 
    initialize: ->
      console.log 'App.initialize'
      new Router(app: this)
      return
    title: '<%= _.capitalize(appname) %>'
  App
