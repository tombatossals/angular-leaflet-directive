'use strict';


module.exports = function (grunt, options) {
    return {
        unit: {
            configFile: 'test/karma-unit.conf.js',
            autoWatch: false,
            singleRun: true
        },
        'unit-mocha': {
            configFile: 'test/karma-unit.conf.js',
            autoWatch: false,
            singleRun: true,
            reporters: ['mocha']
        },
        'unit-dots': {
            configFile: 'test/karma-unit.conf.js',
            autoWatch: false,
            singleRun: true,
            reporters: ['dots']
        },
        'unit-chrome': {
            configFile: 'test/karma-unit.conf.js',
            browsers: ['Chrome'],
            autoWatch: true,
            singleRun: false
        },
        'unit-chrome-mocha': {
            configFile: 'test/karma-unit.conf.js',
            browsers: ['Chrome'],
            autoWatch: true,
            singleRun: false,
            reporters: ['mocha']
        },
        'unit-chrome-once': {
            configFile: 'test/karma-unit.conf.js',
            browsers: ['Chrome'],
            autoWatch: true,
            singleRun: true
        },
        unit_coverage: {
            configFile: 'test/karma-unit.conf.js',
            autoWatch: false,
            singleRun: true,
            //logLevel: 'DEBUG',
            reporters: ['progress', 'coverage'],
            preprocessors: {
                'test/**/**/*.coffee': ['coffee'],
                'dist/angular-leaflet-directive.js': ['coverage']
            },
            coverageReporter: {
                reporters:[
                    {type: 'lcov', dir:'coverage/', subdir:'report'},
                    {type: 'text-summary', dir:'coverage/', subdir:'report'}
                ]
            }
        }
    };
};
