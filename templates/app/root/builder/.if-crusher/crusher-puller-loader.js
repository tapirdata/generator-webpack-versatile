let crusher

module.exports = function(source) {
  if (!crusher.enabled) {
    return source
  }
  let callback = this.async()
  let fileinfo = { path: this.resourcePath }
  crusher.pullString(source, fileinfo)
    .then(result => callback(null, result))
    .catch(err => callback(err))
}

module.exports.setCrusher = function(_crusher) {
  crusher = _crusher
}
