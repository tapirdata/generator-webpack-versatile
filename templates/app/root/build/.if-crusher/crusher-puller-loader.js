
module.exports = function(source) {
  let crusher = this.options.crusher;
  if (crusher.enabled) {
    let fakeFile = {path: this.resourcePath};
    let tagger = crusher.getTagger();
    let optioner = crusher.pullOptioner.bind(crusher, {});
    let options = optioner(fakeFile);
    if (options.pattern != null) {
      let tag = tagger(fakeFile);
      let rest = source;
      let matches = [];
      let strs = [];
      while (true) {
        let match = options.pattern.exec(rest);
        if (match == null) {
          break;
        }
        let matchLength = match[0].length;
        strs.push(rest.slice(0, match.index));
        matches.push(match);
        rest = rest.slice(match.index + matchLength);
      }
      if (matches.length >  0) {
        let callback = this.async();
        // console.log('resourcePath=', this.resourcePath, 'tag=', tag);
        // console.log('strs=', strs);
        // console.log('rest=', rest);
        let promises = [];
        for (let match of matches) {
          // console.log('match=', match);
          promises.push(new Promise(function(resolve, reject) {
            options.substitute(match, tag, (err, replacement) => {
              // console.log('====>', err, replacement);
              if (err) {
                reject(err);
              } else {
                resolve(replacement);
              }
            });
          }));
        }
        Promise.all(promises)
        .then(replacements => {
          let result = '';
          // console.log('replacements=', replacements);
          for (let idx=0; idx<matches.length; ++idx) {
            result += strs[idx];
            let replacement = replacements[idx];
            if (replacement == null) {
              replacement = matches[idx][0];
            }
            result += replacement;
          }
          result += rest;
          callback(null, result);
        })
        .catch(err => {
          callback(err);
        });
      }
    }
  }  
  return source;
}
