import _ from 'lodash';

class TestSetting {

  constructor(answers, opt = {}) {
    this.answers = answers;
    this.unsupported = opt.unsupported;
    this.full = opt.full;
  }

  getAnswers() {
    return this.answers;
  }

  toString() {
    const { answers } = this;
    return `(framework=${answers.framework}, frontend=${answers.frontend}, features=[${answers.features.join(',')}])`;
  }

  static fromString(s) {
    const parts = s.split(/, */);
    function hasPart(part) {
      return parts.indexOf(part) >= 0;
    }

    const answers = {
      framework: hasPart('marionette') ? 'marionette' : hasPart('backbone') ? 'backbone': 'none',
      frontend: hasPart('foundation') ? 'foundation' : hasPart('bootstrap') ? 'bootstrap': 'none',
      features: _(TestSetting.featureNames)
        .filter(name => hasPart(name))
        .value(),
      noAdjust: true,
    };
    const opt = {
      full: hasPart('full'),
      unsupported: hasPart('unsupported'),
    };
    return new TestSetting(answers, opt);
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


