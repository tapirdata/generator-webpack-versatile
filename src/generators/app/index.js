import path from 'path';
import yosay from 'yosay';
import ejs from 'ejs';
import Makeup from './makeup';

import BaseGenerator from '../../lib/base';


class AppGenerator extends BaseGenerator {

  constructor(...args) {
    super(...args);
    // console.log('AppGenerator appname=', this.appname);
    this.sourceRoot(path.join(__dirname, '../../../templates/app'));
    this._setupMakeup();
  }

  _setupMakeup() {
    const makeup = new Makeup(this);
    makeup.applyConfig(this.config.getAll());
    makeup.applyOptions(this.options);
    makeup.applyDefaults(this.appname);
    this.makeup = makeup;
  }

  prompting () {
    if (!this.options['skip-welcome-message']) {
      // Have Yeoman greet the user.
      this.log(yosay('Welcome to the marvelous WebpackVersatile generator!'));
    }

    let questions = this.makeup.getQuestions();
    return this.prompt(questions)
      .then(answers => {
        this.makeup.putAnswers(answers);
      }
    );
  }

  configuring() {
    this.config.set(this.makeup.getPermanetConfig());
    this.config.save();
  }

  writing() {
    const templateConfig = this.makeup.getTemplateConfig();
    const dirs = templateConfig.dirs;

    const templateTransformer = {
      src: /^%(.*)/,
      tgt: '$1',
      fn: s => {
        return ejs.render(s, templateConfig);
      }
    };

    // this.log('copy project files');
    this._branchCopy({
      source: 'root',
      branches: templateConfig.use,
      transformers: [templateTransformer],
    });

    // this.log('copy src files');
    this._branchCopy({
      source: 'src',
      target: dirs.src,
      branches: templateConfig.use,
      transformers: [templateTransformer],
    });

    // this.log('copy test files');
    this._branchCopy({
      source: 'test',
      target: dirs.test,
      branches: templateConfig.use,
      transformers: [templateTransformer],
    });
  }

  install() {
    if (!this.options['skip-install']) {
      this.installDependencies();
    }
  }
}

export default AppGenerator;
