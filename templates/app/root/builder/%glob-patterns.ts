const TS = "**/*.ts"

export default {
  ALL: "**/*",
  JS: "**/*.js",
  TS,
  SCRIPT: TS,
  TEST: "**/*.test.js",
  PUG: "**/*.pug",
  CSS: "**/*.css",
<% if (use.sass) { -%>
  SASS: "**/*.sass",
  SCSS: "**/*.scss",
<% } -%>
}
