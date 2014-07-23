'use strict';


module.exports = function (grunt, options) {
    return {
        unit: {
            configFile: 'test/karma-unit.conf.js',
            autoWatch: false,
            singleRun: true
        },
        unit_coverage: {
            configFile: 'test/karma-unit.conf.js',
            autoWatch: false,
            singleRun: true,
            //logLevel: 'DEBUG',
            reporters: ['progress', 'coverage'],
            preprocessors: {
                'dist/angular-leaflet-directive.js': ['coverage']
            },
            coverageReporter: {
                type : 'lcov',
                dir : 'coverage/'
            }
        }
    };
};
