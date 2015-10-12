_ = require 'lodash'

class TestSetting
  featureNames: ['backbone', 'bootstrap', 'coffee', 'sass', 'crusher']
  constructor: (options) -> 
    for name in @featureNames
      do (name) =>
       @[name] = !!options[name]
       return
    @unsupported = !! options.unsupported
    @full = !! options.full

  activeFeatures: -> 
    names = []
    for name in @featureNames
      do (name) => 
        if @[name]
          names.push(name)
          return
    names    

  toString: -> 
    '(features=[' + @activeFeatures().toString() + '])'


exports.testSettings = [
  'full'
  'backbone,full'
  'foundation,unsupported'
  'bootstrap,unsupported'
  'coffee'
  'coffee,backbone'
  'coffee,bootstrap,unsupported'
  'coffee,bootstrap,backbone,unsupported'
  'sass,full'
  'sass,foundation'
  'sass,backbone'
  'sass,foundation,backbone,unsupported'
  'sass,bootstrap'
  'sass,bootstrap,foundation,full'
  'sass,bootstrap,backbone,full'
  'sass,coffee,full'
  'sass,coffee,foundation,full'
  'sass,coffee,backbone,full'
  'sass,coffee,bootstrap,full'
  'sass,coffee,bootstrap,foundation,full'
  'sass,coffee,bootstrap,backbone,full'
  'sass,coffee,bootstrap,crusher,full'
  'sass,coffee,bootstrap,foundation,crusher,full'
  'sass,coffee,bootstrap,backbone,crusher,full'
].map (s) -> 
  parts = s.split(/, */)
  options = _.object _.map parts, (name) -> [name, true]
  new TestSetting(options)



