/* eslint-env mocha  */

import assert from 'assert';

describe('webpack-versatile generator', function() {
  it('can be imported without blowing up', function() {
    this.timeout(5000);
    let app = require('../generators/app');
    assert(app !== undefined);
  });
});
