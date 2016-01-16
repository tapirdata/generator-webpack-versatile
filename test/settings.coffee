_ = require 'lodash'

class TestSetting
  featureNames: ['modernizr', 'foundation', 'bootstrap', 'backbone', 'coffee', 'sass', 'crusher']
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
  'coffee'
  'coffee,backbone'
  'sass,full'
  'sass,backbone'
  'sass,coffee,full'
  'sass,coffee,backbone,full'
  'modernizr,sass,coffee,backbone,full'

  'foundation,unsupported'
  'foundation,modernizr,unsupported'
  'foundation,sass,unsupported'
  'foundation,modernizr,sass,full'
  'foundation,modernizr,sass,backbone,full'
  'foundation,modernizr,sass,coffee,full'
  'foundation,modernizr,sass,coffee,backbone,full'
  'foundation,modernizr,sass,coffee,crusher,full'
  'foundation,modernizr,sass,coffee,backbone,crusher,full'

  'bootstrap,unsupported'
  'bootstrap,sass'
  'bootstrap,sass,backbone,full'
  'bootstrap,sass,coffee,full'
  'bootstrap,sass,coffee,backbone,full'
  'bootstrap,sass,coffee,crusher,full'
  'bootstrap,sass,coffee,backbone,crusher,full'

  'foundation,bootstrap,modernizr,sass,unsupported'

].map (s) -> 
  parts = s.split(/, */)
  options = _.fromPairs _.map parts, (name) -> [name, true]
  new TestSetting(options)



