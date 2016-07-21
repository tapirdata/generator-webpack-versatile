'use strict'

Marionette = require 'backbone.marionette'

module.exports = Marionette.AppRouter.extend
  appRoutes:
    '': 'showHome'
    'about': 'showAbout'
    'contact': 'showContact'
    '*actions': 'defaultAction'

