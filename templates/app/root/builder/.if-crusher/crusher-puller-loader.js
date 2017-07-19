module.exports = function(source) {
  let crusher = this.query.crusher
  if (!crusher.enabled) {
    return source
  }
  let callback = this.async()
  let fileinfo = { path: this.resourcePath }
  crusher.pullString(source, fileinfo)
    .then(result => callback(null, result))
    .catch(err => callback(err))
}
