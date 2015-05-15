'use strict';
var getAvailPort = require('./utils/getAvailPort');
var port = getAvailPort(7777);

var _files = ['src/**/*.js', 'test/unit/**.js', 'test/unit/**.coffee', 'test/e2e/**.js'];

module.exports = function(grunt, options) {
    return {
        options: {
            livereload: port
        },
        fast: {
            files: _files,
            tasks: [
                'fast-build',
                'uglify',
                'concat:license'
            ]
        },
        source: {
            files: _files,
            tasks: [
                'fast-build',
                'uglify',
                'test-unit',
                'concat:license'
            ]
        },
        unit: {
            files: _files,
            tasks: [
                'fast-build',
                'karma:unit'
            ]
        },
        'unit-mocha': {
            files: _files,
            tasks: [
                'fast-build',
                'karma:unit-mocha'
            ]
        },
        chrome: {
            files: _files,
            tasks: [
                'fast-build',
                'karma:unit-chrome'
            ]
        },
        examples: {
            files: ['examples/*.html'],
            tasks: [
                'examples'
            ]
        }
    };
};
