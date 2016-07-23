'use strict'

$ = require 'jquery'
Backbone = require 'backbone'

module.exports = Backbone.View.extend
  initialize: (options) ->
    @template = options.template
    @app = options.app
    return
  render: ->
    @$el.html @template(title: @app.title)
    this

