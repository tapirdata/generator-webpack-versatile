'use strict'

$ = require 'jquery'
Marionette = require 'backbone.marionette'

module.exports = Marionette.LayoutView.extend
  initialize: (options) ->
    @template = options.template
    @app = options.app
    return
  render: ->
    @$el.html @template(title: @app.title)
    Promise.resolve()

