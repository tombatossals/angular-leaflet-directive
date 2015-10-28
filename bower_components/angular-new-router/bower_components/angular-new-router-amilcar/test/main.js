// The entry point for unit tests.

var TEST_REGEXP = /\.spec\.js$/;

function pathToModule(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
}

function onlySpecs(path) {
  return TEST_REGEXP.test(path);
}

function getAllSpecs() {
  return Object.keys(window.__karma__.files)
      .filter(onlySpecs)
      .map(pathToModule);
}

require.config({
  // Karma serves files under `/base`, which is the `basePath` from `karma-conf.js` file.
  baseUrl: '/base',

  paths: {
    assert: './node_modules/rtts-assert/dist/amd/assert',
    'route-recognizer': './node_modules/route-recognizer/lib/route-recognizer'
  },

  // Dynamically load all test files.
  deps: getAllSpecs(),

  // Kickoff Jasmine, once all spec files are loaded.
  callback: window.__karma__.start
});
