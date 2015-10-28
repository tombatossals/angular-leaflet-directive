// This runs the tests for the router in Angular 1.x

var buildDir = require('./config').build.dir;
var sauceConfig = require('./config/karma.sauce.conf');
var travisConfig = require('./config/karma.travis.conf');

module.exports = function(config) {
  var options = {
    frameworks: ['jasmine'],

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-animate/angular-animate.js',
      'node_modules/angular-mocks/angular-mocks.js',

      buildDir + '/*.es5.js',

      'test/*.es5.js',
      'test/*.es5.spec.js'
    ],

    browsers: ['Chrome']
  };

  if (process.argv.indexOf('--sauce') > -1) {
    sauceConfig(options);
    travisConfig(options);
  }

  config.set(options);
};
