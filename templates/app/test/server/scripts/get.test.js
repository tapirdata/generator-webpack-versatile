/* eslint-env mocha  */

import fetch from 'node-fetch';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import validator from 'html-validator';
import setupFactory from '<%= builder.getRelPath(filename, {to: 'scripts/setup'}) %>';
chai.use(chaiAsPromised);
let { expect } = chai;

let defaultOptions = setupFactory();

let check = function(url) {
  let res = null;
  let text = null;
  it('should answer to a request', () =>
    fetch(url)
    .then(function(_res) {
      res = _res;
    })
  );
  it('should serve the root page', () =>
    expect(res.status)
    .to.be.equal(200)
  );
  it('should serve some sort of HTML', () =>
    expect(res.text().then(function(_text) {
      text = _text;
      return _text;
    }))
    .to.eventually.contain('<html>')
  );
  return it('should serve valid HTML5', function() {
    this.timeout(16000);
    return new Promise((resolve, reject) => {
      const opts = {
        data: text,
      };
      validator(opts, function(err, resultJson) {
        if (err) {
          reject(new Error(`Failed to validate html: ${err}`));
        }
        const result = JSON.parse(resultJson);
        let lines = [];
        for (const message of result.messages) {
          if (message.type === 'info') {
            continue;
          }
          lines.push(`[${message.type}] ${message.message} @line ${message.lastLine} column ${message.lastColumn}:`);
          for (const extractLine of message.extract.split('\n')) {
            lines.push(`| ${extractLine}`);
          }
          lines.push('');
        }
        if (lines.length > 0) {
          reject(new Error(`Bad html at '${url}'\n` + lines.join('\n')));
        } else {
          resolve();
        }
      });
    });
  });
};


describe('The Server', function() {
  before(function() {
  });
  check(`http://localhost:${defaultOptions.app.port}/`);
});
