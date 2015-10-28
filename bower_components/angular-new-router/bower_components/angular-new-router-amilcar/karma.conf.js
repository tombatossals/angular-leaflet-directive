// This runs the tests for the router in Angular 2.x

var traceurOptions = require('./config').traceur;
var sauceConfig = require('./config/karma.sauce.conf');
var travisConfig = require('./config/karma.travis.conf');

module.exports = function(config) {
  var options = {
    frameworks: ['jasmine', 'requirejs', 'traceur'],

    files: [
      // The entry point that dynamically imports all the specs.
      {pattern: 'test/main.js', included: true},

      // All the specs and sources are included dynamically from `test/main.js`.
      {pattern: 'src/**/*.ats', included: false},
      {pattern: 'node_modules/route-recognizer/lib/**/*.js', included: false},
      {pattern: 'test/**/*.ats', included: false},

      // The runtime assertion library.
      {pattern: 'node_modules/rtts-assert/dist/amd/assert.js', included: false}
    ],

    preprocessors: {
      '**/*.ats': ['traceur'],
      'node_modules/route-recognizer/lib/**/*.js': ['traceur']
    },

    browsers: ['Chrome'],

    traceurPreprocessor: {
      options: traceurOptions,
      transformPath: function(path) {
        return path.replace(/\.ats$/, '.js');
      }
    }
  };

  if (process.argv.indexOf('--sauce') > -1) {
    sauceConfig(options);
    travisConfig(options);
  }

  config.set(options);
};
