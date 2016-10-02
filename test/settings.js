import _ from 'lodash';

class TestSetting {

  constructor(conf, opt = {}) {
    this.conf = conf;
    this.unsupported = opt.unsupported;
    this.full = opt.full;
  }

  getAnswers() {
    const { conf } = this;
    return {
      frontend: conf.frontend,
      mvend: conf.mvend,
      features: _(this.constructor.featureNames)
        .filter(name => conf.features[name])
        .value(),
    }
  }

  toString() {
    const { conf } = this;
    const sFeatures = _(this.constructor.featureNames)
      .filter(name => conf.features[name])
      .join();
    return `(frontend=${conf.frontend}, mv=${conf.mvend}, features=[${sFeatures}])`;
  }

  static fromString(s) {
    const names = s.split(/, */);
    const hasNames = _(names)
     .map(name => [name, true])
     .fromPairs()
     .value();
    const conf = {
      features: _(TestSetting.featureNames)
        .map(name => [name, !!hasNames[name]])
        .fromPairs()
        .value(),
      frontend: hasNames.foundation ? 'foundation' : hasNames.bootstrap ? 'bootstrap': 'none',
      mvend: hasNames.marionette ? 'marionette' : hasNames.backbone ? 'backbone': 'none',
    }
    const opt = {
      full: !!hasNames.full,
      unsupported: !!hasNames.unsupported,
    }
    return new TestSetting(conf, opt);
  }
}

TestSetting.featureNames = [
  'modernizr',
  'sass',
  'crusher',
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

].map(s => TestSetting.fromString(s) );

export default testSettings;


