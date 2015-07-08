var SERVER_CONFIG = require('./config').server;

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'examples/**/scenario.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://' + SERVER_CONFIG.host + ':' + SERVER_CONFIG.port + '/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
