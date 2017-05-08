import loaderUtils from 'loader-utils';
import ejs from 'ejs';

function substitute(source) {
  const options = loaderUtils.getOptions(this);
  return ejs.render(source, options.params);
}

export default substitute;
