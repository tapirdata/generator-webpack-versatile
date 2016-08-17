import _ from 'lodash';

class TestSetting {
  constructor(options) { 
    for (let i = 0; i < this.featureNames.length; i++) {
      let name = this.featureNames[i];
      (name => {
       this[name] = !!options[name];
     })(name);
    }
    this.unsupported = !!options.unsupported;
    this.full = !!options.full;
  }

  activeFeatures() { 
    let names = [];
    for (let i = 0; i < this.featureNames.length; i++) {
      let name = this.featureNames[i];
      (name => { 
        if (this[name]) {
          names.push(name);
          return;
        }
      })(name);
    }
    return names;    
  }

  toString() { 
    return `(features=[${this.activeFeatures().toString()}])`;
  }
}

TestSetting.prototype.featureNames = [
  'modernizr', 'foundation', 'bootstrap', 'backbone', 'sass', 'crusher'
];


let testSettings = [
  'full',
  'backbone,full',
  'sass,full',
  'sass,backbone,full',
  'modernizr,sass,backbone,full',

  'foundation,unsupported',
  'foundation,modernizr,unsupported',
  'foundation,sass,unsupported',
  'foundation,modernizr,sass,full',
  'foundation,modernizr,sass,backbone,full',
  'foundation,modernizr,sass,crusher,full',
  'foundation,modernizr,sass,backbone,crusher,full',
  'foundation,modernizr,sass,backbone,marionette,crusher,full',

  'bootstrap,unsupported',
  'bootstrap,sass,full',
  'bootstrap,sass,backbone,full',
  'bootstrap,sass,crusher,full',
  'bootstrap,sass,backbone,crusher,full',
  'bootstrap,sass,backbone,marionette,crusher,full',

  'foundation,bootstrap,modernizr,sass,unsupported'

].map(function(s) { 
  let parts = s.split(/, */);
  let options = _.fromPairs(_.map(parts, name => [name, true]));
  return new TestSetting(options);
});

export default testSettings


