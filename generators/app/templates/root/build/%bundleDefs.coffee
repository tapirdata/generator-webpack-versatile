<% if (use.coffee) { %>
coffeeify = require 'coffeeify'<% } %>
jadeify   = require 'jadeify'

module.exports = (build) ->  
  [
    {
      name: 'main'
      entries: "./#{build.dirs.src.client}/scripts/main"
      extensions: [<% if (use.coffee) { %>
        '.coffee'<% } %>
        '.jade'
      ]
      transform: [<% if (use.coffee) { %>
        coffeeify<% } %>
        jadeify
      ]
      debug: true
      watchable: true
      scopes: ['app']
    }
    {
      name: 'test'
      entries: "./#{build.dirs.test.client}/scripts/#{build.globPatterns.TEST}"
      extensions: [<% if (use.coffee) { %>
        '.coffee'<% } %>
        '.jade'
      ]
      transform: [<% if (use.coffee) { %>
        coffeeify<% } %>
        jadeify
      ]
      debug: true
      watchable: true
      destDir: "#{build.dirs.tgt.client}/test/scripts"
      scopes: ['test']
      destName: 'main.js'
    }
    {
      name: 'vendor'
      exports: [
        'jquery'
        'lodash'<% if (use.backbone) { %>
        'backbone'<% } %><% if (use.bootstrap) { %>
        'bootstrap-sass'<% } %>
      ]
    }
  ]

