var loaderUtils = require('loader-utils')
var ejs = require('ejs')

module.exports = function substitute(source) {
  const options = loaderUtils.getOptions(this);
  return ejs.render(source, options.params);
}

