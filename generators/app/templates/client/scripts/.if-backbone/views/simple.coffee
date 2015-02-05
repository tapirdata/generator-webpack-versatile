'use strict'

### global define ###

define [
  'backbone'
  '../templates'
], (Backbone, templates) ->
  View = Backbone.View.extend(
    initialize: (options) ->
      @templateName = options.templateName
      @app = options.app
      return
    render: ->
      templateName = @templateName
      template = templates[templateName]
      @$el.html template(title: @app.title)
      this
  )
  View
