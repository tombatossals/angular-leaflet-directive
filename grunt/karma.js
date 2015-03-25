'use strict';


module.exports = function (grunt, options) {
    var _default = require('./utils/spec-creator')(),
    _chrome = require('./utils/spec-creator')('test/karma-unit-chrome.conf.js', 'chrome');

    return _.merge(_default, _chrome);
};
