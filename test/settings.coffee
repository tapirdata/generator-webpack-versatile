_ = require 'lodash'

class TestSetting
  featureNames: ['backbone', 'foundation', 'bootstrap', 'coffee', 'sass', 'crusher']
  constructor: (options) -> 
    for name in @featureNames
      do (name) =>
       @[name] = !!options[name]
       return
    @unsupported = !! options.unsupported
    @full = !! options.full

  activeFeatures: -> 
    names = ['modernizr']
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

  'foundation,unsupported'
  'coffee,foundation,unsupported'
  'coffee,foundation,backbone,unsupported'
  'sass,foundation'
  'sass,foundation,backbone,full'
  'sass,coffee,foundation,full'
  'sass,coffee,foundation,backbone,full'
  'sass,coffee,foundation,crusher,full'
  'sass,coffee,foundation,backbone,crusher,full'

  'bootstrap,unsupported'
  'coffee,bootstrap,unsupported'
  'coffee,bootstrap,backbone,unsupported'
  'sass,bootstrap'
  'sass,bootstrap,backbone,full'
  'sass,coffee,bootstrap,full'
  'sass,coffee,bootstrap,backbone,full'
  'sass,coffee,bootstrap,crusher,full'
  'sass,coffee,bootstrap,backbone,crusher,full'

  'coffee,foundation,backbone,unsupported'
  'sass,foundation,bootstrap,unsupported'

].map (s) -> 
  parts = s.split(/, */)
  options = _.object _.map parts, (name) -> [name, true]
  new TestSetting(options)



