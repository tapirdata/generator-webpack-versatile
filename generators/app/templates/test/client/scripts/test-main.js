var allTestFiles = [];
var TEST_REGEXP = /^\/base\/\.tmp\/.*(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

console.log('allTestFiles=', allTestFiles);

var vendorBaseUrl = 'http://localhost:9999/vendor/';

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths: {
    jquery: vendorBaseUrl + 'jquery/dist/jquery',
    chai: vendorBaseUrl + 'chai/chai',
    chaiAsPromised: vendorBaseUrl + 'chai-as-promised/lib/chai-as-promised'
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
