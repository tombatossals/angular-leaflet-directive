'use strict';
var pkg = require('./pkg');

module.exports = function (grunt, options) {
    return {
        dist: ["dist/"],
        pre: ['dist/*.pre.js']
    };
};
