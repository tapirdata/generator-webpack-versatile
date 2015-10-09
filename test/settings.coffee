_ = require('lodash')

class TestSetting
  featureNames: ['backbone', 'bootstrap', 'coffee', 'sass', 'crusher']
  constructor: (options) -> 
    for name in @featureNames
      do (name) =>
       this[name] = !!options[name]
       return
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
    '(features=[' + @activeFeatures().toString() + '])'


exports.testSettings = [
  'full'
  # 'backbone,full'
  # 'bootstrap,unsupported'
  # 'coffee'
  # 'coffee,backbone'
  # 'coffee,bootstrap,unsupported'
  # 'coffee,bootstrap,backbone,unsupported'
  # 'sass,full'
  # 'sass,backbone'
  # 'sass,bootstrap'
  # 'sass,bootstrap,backbone,full'
  # 'sass,coffee,full'
  # 'sass,coffee,backbone,full'
  # 'sass,coffee,bootstrap,full'
  # 'sass,coffee,bootstrap,backbone,full'
  # 'sass,coffee,bootstrap,crusher,full'
  # 'sass,coffee,bootstrap,backbone,crusher,full'
].map (s) -> 
  parts = s.split(/, */)
  options = _.object _.map parts, (name) -> [name, true]
  new TestSetting(options)



