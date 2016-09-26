const g = {};

g.ALL    = '**/*';
g.JS     = '**/*.js';
g.SCRIPT = g.JS;
g.TEST   = '**/*.test.js';
g.PUG    = '**/*.pug';
g.CSS    = '**/*.css';<% if (use.sass) { %>
g.SASS   = '**/*.sass';
g.SCSS   = '**/*.scss';<% } %>


export default g;


