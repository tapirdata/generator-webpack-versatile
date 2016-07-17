g = {}

g.ALL    = '**/*'
g.JS     = '**/*.js'<% if (use.coffee) { %>
g.COFFEE = '**/*.coffee'
g.SCRIPT = '**/*.{js,coffee}'
g.TEST   = '**/*.test.{js,coffee}'<% } else { %>
g.SCRIPT = g.JS
g.TEST   = '**/*.test.js'<% } %>
g.JADE   = '**/*.jade'
g.CSS    = '**/*.css'<% if (use.sass) { %>
g.SASS   = '**/*.sass'
g.SCSS   = '**/*.scss'<% } %>


module.exports = g


