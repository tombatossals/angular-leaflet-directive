'use strict';

module.exports = function (grunt, options) {
    return {
        options : {
            livereload: 7777
        },
        fast: {
            files: ['src/**/*.js', 'test/unit/**.js', 'test/e2e/**.js'],
            tasks: [
                'fast-build'
            ]
        },
        source: {
            files: ['src/**/*.js', 'test/unit/**.js', 'test/e2e/**.js'],
            tasks: [
                'fast-build',
                'uglify',
                'test-unit',
                'concat:license'
            ]
        },
        unit: {
            files: ['src/**/*.js', 'test/unit/**.js', 'test/e2e/**.js'],
            tasks: [
                'fast-build',
                'karma:unit'
            ]
        },
        chrome: {
            files: ['src/**/*.js', 'test/unit/**.js', 'test/e2e/**.js'],
            tasks: [
                'fast-build',
                'karma:unit-chrome'
            ]
        }
    };
};
