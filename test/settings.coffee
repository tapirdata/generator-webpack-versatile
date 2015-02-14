_ = require('lodash')

class TestSetting
  featureNames: ['backbone', 'bootstrap', 'coffee', 'sass']
  constructor: (options) -> 
    for name in @featureNames
      do (name) =>
       this[name] = !!options[name]
       return
    @amd = if options.requirejs then 'requirejs' else 'curl'
    @unsupported = !! options.unsupported
    @full = !! options.full

  activeFeatures: -> 
    names = []
    for name in @featureNames
      do (name) => 
        if this[name]
          names.push(name)
          return
    names    

  toString: -> 
    '(features=[' + @activeFeatures().toString() + '] amd=' + @amd + ')'


exports.testSettings = [
  'curl'
  'backbone,curl'
  'bootstrap,curl,unsupported'
  'bootstrap,backbone,curl,unsupported'
  'coffee,curl'
  'coffee,backbone,curl'
  'coffee,bootstrap,curl,unsupported'
  'coffee,bootstrap,backbone,curl,unsupported'
  'sass,curl'
  'sass,backbone,curl'
  'sass,bootstrap,curl'
  'sass,bootstrap,backbone,curl'
  'sass,coffee,curl'
  'sass,coffee,backbone,curl'
  'sass,coffee,bootstrap,curl,full'
  'sass,coffee,bootstrap,backbone,curl,nofull'
  'requirejs'
  'backbone,requirejs'
  'bootstrap,requirejs,unsupported'
  'bootstrap,backbone,requirejs,unsupported'
  'coffee,requirejs'
  'coffee,backbone,requirejs'
  'coffee,bootstrap,requirejs,unsupported'
  'coffee,bootstrap,backbone,requirejs,unsupported'
  'sass,requirejs'
  'sass,backbone,requirejs'
  'sass,bootstrap,requirejs'
  'sass,bootstrap,backbone,requirejs'
  'sass,coffee,requirejs'
  'sass,coffee,backbone,requirejs'
  'sass,coffee,bootstrap,requirejs'
  'sass,coffee,bootstrap,backbone,requirejs'
].map (s) -> 
  parts = s.split(/, */)
  options = _.object _.map parts, (name) -> [name, true]
  new TestSetting(options)



